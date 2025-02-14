#!/bin/bash

# Exit on error
set -e

# Function to print colored messages
print_message() {
    echo -e "\e[1;34m>> $1\e[0m"
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
print_message "Installing Docker and Docker Compose..."
apt update && apt upgrade -y
apt install -y docker.io docker-compose
systemctl enable docker
systemctl start docker

# Step 2: Clone the Repository
print_message "Cloning the repository..."
cd /opt
git clone https://github.com/marketcalls/openalgo-multiuser.git
cd openalgo-multiuser

# Step 3: Configure Environment Variables
print_message "Copying .env.example to .env..."
cp .env.example .env
print_message "Please update the .env file with your configuration"

# Step 4: Build and Run Docker Containers
print_message "Building and starting Docker containers..."
docker-compose up -d --build

# Step 5: Install and Configure Nginx
print_message "Installing and configuring Nginx..."
apt install -y nginx

# Create Nginx configuration
cat > /etc/nginx/sites-available/openalgo << EOL
server {
    listen 80;
    server_name $DOMAIN_NAME;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
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

# Enable Nginx configuration
ln -s /etc/nginx/sites-available/openalgo /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Step 6: Install Certbot and get SSL certificate
print_message "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

print_message "Please run the following command manually to configure SSL:"
echo "sudo certbot --nginx -d $DOMAIN_NAME"

# Step 7: Set up auto-start on reboot
print_message "Setting up auto-start on reboot..."
(crontab -l 2>/dev/null; echo "@reboot sleep 10 && cd /opt/openalgo-multiuser && docker-compose up -d") | crontab -

print_message "Installation complete! Please:"
echo "1. Update the domain name in /etc/nginx/sites-available/openalgo"
echo "2. Run: sudo certbot --nginx -d $DOMAIN_NAME"
echo "3. Update the .env file with secure credentials"
echo "4. Reboot to verify everything starts correctly: sudo reboot"
