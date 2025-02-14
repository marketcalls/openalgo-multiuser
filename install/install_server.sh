#!/bin/bash

# Exit on error
set -e

# Function to print colored messages
print_message() {
    echo -e "\e[1;34m>> $1\e[0m"
}

# Function to check if a package is installed
is_installed() {
    dpkg -l "$1" | grep -q ^ii
}

# Function to check if a service is active
is_active() {
    systemctl is-active --quiet "$1"
}

# Function to safely stop containers
safe_stop_containers() {
    if [ -f "docker-compose.yml" ]; then
        print_message "Stopping existing containers..."
        docker-compose down || true
    fi
}

# Function to validate domain name
validate_domain() {
    if [[ $1 =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$ ]]; then
        return 0
    else
        return 1
    fi
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Get domain name from user
while true; do
    read -p "Enter your domain name (e.g., openalgo.in or demo.openalgo.in): " DOMAIN_NAME
    if validate_domain "$DOMAIN_NAME"; then
        print_message "Domain name validated: $DOMAIN_NAME"
        break
    else
        echo "Invalid domain name format. Please try again."
    fi
done

# Step 1: Install Docker and Docker Compose
print_message "Checking and installing Docker and Docker Compose..."
apt update

if ! is_installed docker.io; then
    print_message "Installing Docker..."
    apt install -y docker.io
fi

if ! is_installed docker-compose; then
    print_message "Installing Docker Compose..."
    apt install -y docker-compose
fi

if ! is_active docker; then
    print_message "Starting Docker service..."
    systemctl enable docker
    systemctl start docker
fi

# Step 2: Clone or Update Repository
print_message "Setting up repository..."

# Ensure we're in /opt directory
cd /opt || {
    print_message "Failed to change to /opt directory"
    exit 1
}

# Function to handle repository setup
setup_repository() {
    local repo_path="/opt/openalgo-multiuser"
    
    # If directory exists but is not a git repo
    if [ -d "$repo_path" ] && [ ! -d "$repo_path/.git" ]; then
        print_message "Removing existing non-git directory..."
        rm -rf "$repo_path"
    fi

    # If git repository exists
    if [ -d "$repo_path/.git" ]; then
        print_message "Repository exists, updating..."
        cd "$repo_path" || exit 1
        
        # Reset any changes and update
        git fetch origin || {
            print_message "Failed to fetch updates. Removing and cloning fresh..."
            cd /opt
            rm -rf "$repo_path"
            git clone https://github.com/marketcalls/openalgo-multiuser.git
        }
        
        git reset --hard origin/master
        git clean -fd
    else
        print_message "Cloning fresh repository..."
        git clone https://github.com/marketcalls/openalgo-multiuser.git
    fi

    # Ensure we're in the repository directory
    cd "$repo_path" || {
        print_message "Failed to change to repository directory"
        exit 1
    }
}

# Execute repository setup
setup_repository

# Step 3: Configure Environment Variables
if [ ! -f ".env" ]; then
    print_message "Creating .env file from example..."
    cp .env.example .env
    print_message "Please update the .env file with your configuration"
else
    print_message ".env file exists, skipping creation"
fi

# Step 4: Build and Run Docker Containers
print_message "Managing Docker containers..."
safe_stop_containers
print_message "Building and starting Docker containers..."
docker-compose up -d --build

# Step 5: Install and Configure Nginx
print_message "Checking and configuring Nginx..."
if ! is_installed nginx; then
    print_message "Installing Nginx..."
    apt install -y nginx
fi

# Configure Nginx
print_message "Configuring Nginx for $DOMAIN_NAME..."

# Remove existing symlink if it exists
if [ -L "/etc/nginx/sites-enabled/openalgo" ]; then
    rm -f /etc/nginx/sites-enabled/openalgo
fi

# Create/Update Nginx configuration
cat > /etc/nginx/sites-available/openalgo << EOL
server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Larger upload size for API
    client_max_body_size 50M;

    # Better timeouts for long-running requests
    proxy_connect_timeout 60;
    proxy_send_timeout 60;
    proxy_read_timeout 60;
    send_timeout 60;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

# Create symlink and verify configuration
ln -sf /etc/nginx/sites-available/openalgo /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t || {
    print_message "Nginx configuration test failed. Rolling back..."
    rm -f /etc/nginx/sites-enabled/openalgo
    exit 1
}

# Restart nginx
systemctl restart nginx || {
    print_message "Failed to restart Nginx. Rolling back..."
    rm -f /etc/nginx/sites-enabled/openalgo
    exit 1
}

# Step 6: Configure UFW Firewall
print_message "Checking and configuring UFW Firewall..."
if ! is_installed ufw; then
    print_message "Installing UFW..."
    apt install -y ufw
fi

# Add rules only if they don't exist
if ! ufw status | grep -q "22/tcp"; then
    ufw allow 22/tcp    # SSH
fi
if ! ufw status | grep -q "80/tcp"; then
    ufw allow 80/tcp    # HTTP
fi
if ! ufw status | grep -q "443/tcp"; then
    ufw allow 443/tcp   # HTTPS
fi

# Enable UFW if not already enabled
if ! ufw status | grep -q "Status: active"; then
    ufw --force enable
fi

ufw status

# Step 7: Install Certbot and get SSL certificate
print_message "Checking and configuring SSL..."
if ! is_installed certbot; then
    print_message "Installing Certbot..."
    apt install -y certbot python3-certbot-nginx
fi

# Check if certificate already exists
if [ ! -d "/etc/letsencrypt/live/$DOMAIN_NAME" ]; then
    print_message "Obtaining SSL certificate for $DOMAIN_NAME..."
    certbot --nginx -d "$DOMAIN_NAME" --non-interactive --agree-tos --email "admin@$DOMAIN_NAME" --redirect
else
    print_message "SSL certificate already exists for $DOMAIN_NAME"
fi

# Step 8: Set up auto-start on reboot
print_message "Checking auto-start configuration..."
if ! crontab -l 2>/dev/null | grep -q "openalgo-multiuser"; then
    print_message "Setting up auto-start on reboot..."
    (crontab -l 2>/dev/null; echo "@reboot sleep 10 && cd /opt/openalgo-multiuser && docker-compose up -d") | crontab -
else
    print_message "Auto-start already configured"
fi

print_message "Installation complete! Please:"
echo "1. Update the .env file with secure credentials"
echo "2. Reboot to verify everything starts correctly: sudo reboot"
echo "
Your OpenAlgo instance should now be accessible at:
https://$DOMAIN_NAME (Frontend)
https://$DOMAIN_NAME/api/docs (API Documentation)
"
