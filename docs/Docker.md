# Installing Docker in a Development Server with a Custom Domain

## ⚠️ Warning: Development/Test Use Only
This document provides instructions for setting up a FastAPI + React application using Docker on a **development or test server only**. This setup is **not recommended for production** as it lacks security hardening, monitoring, and scalability best practices.

---

## Prerequisites
Before proceeding, ensure you have the following:
- **Ubuntu 20.04+** server
- **A domain name** mapped to your server via **Cloudflare** (or any other DNS provider)
- **Basic knowledge** of Linux, Docker, and Nginx

---

## Step 1: Install Docker and Docker Compose
Run the following commands to install Docker and Docker Compose:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
```

---

## Step 2: Clone the Application Repository
Navigate to your preferred directory and clone the repository:

```bash
cd /opt  # Change directory as needed
sudo git clone https://github.com/marketcalls/openalgo-multiuser.git
cd openalgo-multiuser
```

---

## Step 3: Configure Environment Variables
Create a `.env` file in the project root:

```bash
nano .env
```

Add the following details (modify as needed):

```env
POSTGRES_USER=openalgo
POSTGRES_PASSWORD=securepassword
POSTGRES_DB=openalgo_db
POSTGRES_PORT=5432
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
AUTO_LOGOUT_TIME=30
AUTO_LOGOUT_TIMEZONE=UTC
```

Save and exit (`CTRL + X`, then `Y`, then `ENTER`).

---

## Step 4: Build and Run Docker Containers
Run the following command to build and start the application:

```bash
sudo docker-compose up -d --build
```

Verify that all containers are running:

```bash
sudo docker ps
```

---

## Step 5: Set Up Nginx Reverse Proxy
### Install Nginx
```bash
sudo apt install -y nginx
```

### Create Nginx Configuration File
```bash
sudo nano /etc/nginx/sites-available/openalgo
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name demo.openalgo.in;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save and exit.

### Enable the Configuration
```bash
sudo ln -s /etc/nginx/sites-available/openalgo /etc/nginx/sites-enabled/
sudo nginx -t  # Check for syntax errors
sudo systemctl restart nginx
```

---

## Step 6: Secure with Let’s Encrypt (SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d demo.openalgo.in
```
Follow the instructions to obtain an SSL certificate.

---

## Step 7: Verify Deployment
- Visit `http://demo.openalgo.in` → React frontend should load.
- Visit `http://demo.openalgo.in/api/docs` → FastAPI Swagger UI should be accessible.

Check logs if needed:
```bash
sudo docker logs openalgo-backend -f
sudo docker logs openalgo-frontend -f
sudo docker logs openalgo-db -f
```

---

## Step 8: Ensure Containers Start on Reboot (Optional)
Add the following command to crontab:

```bash
sudo crontab -e
```

Add this line at the bottom:
```bash
@reboot sleep 10 && cd /opt/openalgo-multiuser && sudo docker-compose up -d
```

Save and exit.

Verify crontab:
```bash
sudo crontab -l
```

Reboot and check if containers start automatically:
```bash
sudo reboot
```

After rebooting, check running containers:
```bash
sudo docker ps
```

---

## ✅ Conclusion
Your FastAPI + React application is now running on Docker with Nginx and a custom domain. Remember, **this setup is for development or testing only**. If deploying to production, ensure you implement additional security measures, monitoring, and scaling solutions.

🚀 Happy Developing!

