# Installing OpenAlgo on Ubuntu Server

This guide explains how to install OpenAlgo on an Ubuntu server using our automated installation script.

## Prerequisites

Before you begin, ensure you have:

1. A fresh Ubuntu server (20.04 or later)
2. Root or sudo access to the server
3. A domain name pointed to your server's IP address (via DNS A record)
4. Git installed on your server

## Installation Steps

### 1. Install Git (if not installed)

```bash
sudo apt update
sudo apt install git -y
```

### 2. Clone the Repository

```bash
cd /opt
sudo git clone https://github.com/marketcalls/openalgo-multiuser.git
cd openalgo-multiuser
```

### 3. Make the Installation Script Executable

```bash
sudo chmod +x install/install_server.sh
```

### 4. Run the Installation Script

```bash
sudo ./install/install_server.sh
```

During the installation:
- You will be prompted to enter your domain name (e.g., openalgo.in or demo.openalgo.in)
- The script will validate your domain name format
- The installation will proceed automatically after validation

The script will:
- Install Docker and Docker Compose
- Set up the OpenAlgo application
- Configure Nginx as a reverse proxy
- Set up SSL certificate prerequisites
- Configure auto-start on system reboot

### 5. Post-Installation Steps

After the script completes, you'll need to:

1. Update your `.env` file with appropriate configuration values:
   ```bash
   sudo nano .env
   ```

2. Set up SSL certificate for your domain (the script will provide the exact command)
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. Reboot your server to verify everything starts correctly:
   ```bash
   sudo reboot
   ```

### 6. Verify Installation

After the server reboots:

1. Visit `https://your-domain.com` - You should see the OpenAlgo frontend
2. Visit `https://your-domain.com/api/docs` - You should see the API documentation

## Troubleshooting

If you encounter any issues:

1. Check Docker container status:
   ```bash
   sudo docker ps
   ```

2. View container logs:
   ```bash
   sudo docker logs openalgo-backend -f
   sudo docker logs openalgo-frontend -f
   sudo docker logs openalgo-db -f
   ```

3. Check Nginx configuration:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## Security Note

This installation is configured for development/testing environments. For production use, additional security measures should be implemented, including:

- Firewall configuration
- Regular security updates
- Proper user management
- Database backup strategy
- Monitoring and logging solutions

## Support

If you encounter any issues or need assistance, please:
1. Check the [GitHub Issues](https://github.com/marketcalls/openalgo-multiuser/issues) page
2. Create a new issue if your problem hasn't been reported

---

🔒 Remember to always follow security best practices when setting up a server and never share your credentials or API keys.
