# Installation Guide

## System Requirements

### Minimum Requirements
- CPU: 2 cores
- RAM: 4 GB
- Disk: 20 GB
- OS: Linux, macOS, or Windows (with WSL2)

### Recommended Requirements
- CPU: 4+ cores
- RAM: 8+ GB
- Disk: 50+ GB SSD
- OS: Ubuntu 20.04 LTS or later

## Prerequisites

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- Python 3.12+ (for local development)
- Node.js 18+ (for local development)
- Git 2.30+

### Optional Software
- PostgreSQL 14+ (for production)
- Redis 6+ (for caching)
- Nginx 1.18+ (for reverse proxy)

## Installation Methods

### Method 1: Docker Compose (Recommended)

#### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/CyberJana/openbmc-platform.git
cd openbmc-platform

# 2. Copy environment file
cp .env.example .env

# 3. Edit environment variables
vim .env

# 4. Start services
docker-compose up -d

# 5. Wait for services to be ready
sleep 30

# 6. Initialize database
docker-compose exec backend python -m alembic upgrade head

# 7. Create admin user
docker-compose exec backend python scripts/create_admin.py

# 8. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

#### Verify Installation

```bash
# Check container status
docker-compose ps

# Check backend logs
docker-compose logs backend

# Test API health
curl http://localhost:8000/health
```

### Method 2: Local Development Setup

#### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 4. Upgrade pip
pip install --upgrade pip

# 5. Install dependencies
pip install -r requirements.txt

# 6. Create database
python -m alembic upgrade head

# 7. Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit environment variables
vim .env.local

# 5. Start development server
npm start
```

### Method 3: Production Deployment

#### Using Docker Swarm

```bash
# 1. Initialize Docker Swarm
docker swarm init

# 2. Deploy stack
docker stack deploy -c docker/docker-compose.yml openbmc

# 3. Check status
docker service ls
```

#### Using Kubernetes

```bash
# 1. Create namespace
kubectl create namespace openbmc

# 2. Create secrets
kubectl -n openbmc create secret generic db-credentials \
  --from-literal=password=secure_password

# 3. Deploy application
kubectl apply -f kubernetes/

# 4. Check status
kubectl -n openbmc get pods
```

## Configuration

### Environment Variables

Key environment variables in `.env`:

```bash
# Application
APP_NAME="OpenBMC Firmware Research Platform"
DEBUG=False
ENVIRONMENT=production
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Security
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# BMC Settings
BMC_HOST=192.168.1.100
BMC_USERNAME=root
BMC_PASSWORD=password

# Frontend
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### Database Setup

#### SQLite (Development)

No setup needed - automatically created at `openbmc.db`

#### PostgreSQL (Production)

```bash
# Create database
createdb openbmc_platform

# Create user
createuser openbmc_user

# Grant privileges
psql openbmc_platform -c "GRANT ALL PRIVILEGES ON DATABASE openbmc_platform TO openbmc_user;"

# Run migrations
cd backend
alembic upgrade head
```

### SSL/TLS Configuration

#### Self-signed Certificate (Development)

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Place in docker/ssl/
mkdir -p docker/ssl
mv cert.pem docker/ssl/
mv key.pem docker/ssl/
```

#### Let's Encrypt (Production)

```bash
# Using Certbot
certbot certonly --standalone -d your-domain.com

# Update nginx configuration with certificate path
```

## Verification

### Health Checks

```bash
# API health
curl http://localhost:8000/health

# Database connection
curl -X GET http://localhost:8000/api/v1/dashboard/health

# Frontend
curl http://localhost:3000
```

### Log Review

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f database
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or change the port in docker-compose.yml
```

#### Database Connection Error

```bash
# Check database container
docker-compose ps database

# Check database logs
docker-compose logs database

# Restart database
docker-compose restart database
```

#### Backend Not Starting

```bash
# Check backend logs
docker-compose logs backend

# Rebuild backend image
docker-compose build --no-cache backend

# Restart
docker-compose up -d backend
```

#### Frontend Not Loading

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart frontend
npm start
```

## Post-Installation

### Create Admin User

```bash
# Using Docker
docker-compose exec backend python scripts/create_admin.py

# Or locally
cd backend
python scripts/create_admin.py
```

### Configure BMC Connection

1. Login to http://localhost:3000
2. Navigate to Settings
3. Add BMC System with IP, username, password
4. Test connection

### Backup Database

```bash
# Docker
docker-compose exec database pg_dump openbmc_db > backup.sql

# Local
pg_dump openbmc_db > backup.sql
```

## Security Hardening

### Before Production

1. Change default admin password
2. Update SECRET_KEY in environment
3. Enable HTTPS
4. Configure firewall rules
5. Set up monitoring and alerts
6. Enable audit logging
7. Implement backup strategy

### Recommended Security Practices

- Run behind reverse proxy (Nginx/HAProxy)
- Use strong passwords (16+ characters)
- Enable 2FA for admin accounts
- Regular security updates
- Monitor access logs
- Implement rate limiting
- Use VPN for remote access

## Performance Tuning

### Database Optimization

```bash
# Connection pooling
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40

# Query optimization
SQLALCHEMY_ECHO=False  # Disable in production
```

### Backend Optimization

```bash
# Worker processes
workers = 4
worker_class = uvicorn.workers.UvicornWorker

# Request timeout
timeout = 30
```

## Next Steps

1. Review [API Documentation](API.md)
2. Configure [BMC Systems](CONFIGURATION.md)
3. Set up [Monitoring](MONITORING.md)
4. Read [Developer Guide](DEVELOPER.md)

## Support

- Issues: https://github.com/CyberJana/openbmc-platform/issues
- Documentation: /docs
- Discussions: https://github.com/CyberJana/openbmc-platform/discussions