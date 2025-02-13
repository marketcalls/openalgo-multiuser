# OpenAlgo Multiuser Platform - Installation Guide

This guide will help you set up and run the OpenAlgo Multiuser Platform, a modern web application built with FastAPI, Tortoise ORM, PostgreSQL, and React JS, fully containerized with Docker.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/marketcalls/openalgo-multiuser
cd openalgo-multiuser
```

### 2. Environment Setup
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure the following variables in `.env`:
```env
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
POSTGRES_PORT=5432
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
AUTO_LOGOUT_TIME=03:30
AUTO_LOGOUT_TIMEZONE=Asia/Kolkata
```

### 3. Build and Start Services
```bash
# Build and start all services
docker-compose up --build

# To run in detached mode (background)
docker-compose up --build -d
```

### 4. Verify Installation
Once all containers are running, you can access:
- Frontend Application: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- API Alternative Documentation: http://localhost:8000/redoc

## Component Details

### Backend (FastAPI + Tortoise ORM)
- Port: 8000
- Auto-reload enabled for development
- Swagger documentation available
- PostgreSQL database integration

### Frontend (React JS)
- Port: 3000
- Hot-reload enabled for development
- Modern UI/UX
- Responsive design

### Database (PostgreSQL)
- Port: 5432
- Persistent volume for data storage
- Health checks enabled

## Development Mode

To run individual services for development:

1. Start only the database:
```bash
docker-compose up db
```

2. Start the backend service:
```bash
docker-compose up backend
```

3. Start the frontend service:
```bash
docker-compose up frontend
```

## Troubleshooting

1. If containers fail to start:
```bash
# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

2. To reset the environment:
```bash
# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

3. Database connection issues:
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs db`
- Verify environment variables in `.env` file

## Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull

# Rebuild containers
docker-compose build

# Restart services
docker-compose up -d
```

### Backup Database
```bash
# Create a backup
docker-compose exec db pg_dump -U your_user -d your_database > backup.sql

# Restore from backup
docker-compose exec -T db psql -U your_user -d your_database < backup.sql
```

## Security Notes

1. Never commit the `.env` file to version control
2. Regularly update the `SECRET_KEY`
3. Use strong passwords for database credentials
4. Keep Docker and all dependencies updated

## Support

For additional support or to report issues:
1. Check the documentation in the `docs` directory
2. Submit issues through the project's issue tracker
3. Contact the development team
