# OpenBMC Firmware Research Platform

A comprehensive full-stack application for Baseboard Management Controller (BMC) research, firmware analysis, and hardware monitoring using OpenBMC and Redfish REST APIs.

## 🎯 Overview

The OpenBMC Firmware Research Platform provides researchers, engineers, and system administrators with powerful tools to:

- **Communicate** with BMC systems via Redfish REST APIs
- **Analyze** firmware and system health metrics
- **Monitor** real-time hardware status (CPU, memory, temperature, power)
- **Manage** user accounts and access controls
- **Automate** Redfish API testing and validation
- **Visualize** hardware health through interactive dashboards
- **Track** system events and logs

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Python 3.12 with FastAPI
- SQLite + SQLAlchemy ORM
- JWT Authentication
- OpenAPI/Swagger Documentation

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS + ShadCN UI
- Real-time hardware monitoring
- Interactive charts and visualizations

**DevOps:**
- Docker & Docker Compose
- NGINX reverse proxy
- GitHub Actions CI/CD
- Automated testing and deployment

## 📁 Project Structure

```
openbmc-platform/
├── backend/                 # Python FastAPI application
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── database/       # Database configuration
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   ├── core/           # Core configuration
│   │   └── main.py         # FastAPI app entry
│   ├── tests/              # Pytest test suite
│   ├── requirements.txt    # Python dependencies
│   ├── pyproject.toml      # Project metadata
│   └── Dockerfile          # Backend container
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client services
│   │   ├── assets/         # Images and static files
│   │   └── App.tsx         # Main app component
│   ├── package.json        # Node.js dependencies
│   ├── tsconfig.json       # TypeScript config
│   ├── tailwind.config.js  # Tailwind configuration
│   └── Dockerfile          # Frontend container
├── docker/
│   ├── docker-compose.yml  # Multi-container setup
│   └── nginx.conf          # NGINX configuration
├── docs/                   # Documentation
│   ├── API.md              # API documentation
│   ├── ARCHITECTURE.md     # Architecture guide
│   ├── INSTALLATION.md     # Installation guide
│   └── DEPLOYMENT.md       # Deployment guide
├── scripts/                # Utility scripts
├── postman/                # Postman collection
├── .github/                # GitHub configuration
│   ├── workflows/          # CI/CD workflows
│   └── ISSUE_TEMPLATE/     # Issue templates
├── LICENSE                 # Apache 2.0 License
├── .gitignore              # Git ignore rules
├── Makefile                # Build automation
└── .env.example            # Environment variables template
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.12+ (for local development)
- Node.js 18+ (for frontend development)
- Git

### Docker Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/CyberJana/openbmc-platform.git
cd openbmc-platform

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# API Documentation: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc
```

### Local Development Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m pytest tests/
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for secure authentication.

**Default Admin Credentials:**
```
Email: admin@openbmc.local
Password: OpenBMC@123!
```

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

**Login Endpoint:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@openbmc.local",
    "password": "OpenBMC@123!"
  }'
```

## 📊 Dashboard Features

### Real-time Monitoring
- **CPU Usage**: Live CPU utilization graph
- **Memory Usage**: Memory consumption tracking
- **Temperature**: Thermal sensor monitoring
- **Fan Speed**: Fan RPM monitoring
- **Power Consumption**: Real-time power metrics
- **System Status**: Overall health indicator

### System Information
- Firmware version
- BIOS version
- System serial number
- Manufacturer info
- Chassis type

### Hardware Inventory
- Processors
- Memory modules
- Storage devices
- Network interfaces
- Power supplies
- Fans

## 🔌 Redfish API Support

Comprehensive Redfish endpoint support including:

| Category | Endpoints |
|----------|----------|
| **System** | Systems, ComputerSystems, Boot, Reset |
| **Chassis** | Chassis, Power, Thermal, Sensors |
| **Managers** | Managers, NetworkProtocol, RemoteAccess |
| **Storage** | Storage, Drives, Volumes |
| **Network** | EthernetInterfaces, Vlans |
| **Accounts** | Accounts, Roles, Privileges |
| **Firmware** | FirmwareInventory, FirmwareUpdate |
| **Logs** | Systems/LogServices, SEL |
| **Events** | EventService, Subscriptions |

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout

### Users & Admin
- `GET /api/v1/users` - List users (admin)
- `POST /api/v1/users` - Create user (admin)
- `GET /api/v1/users/{id}` - Get user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user (admin)

### Dashboard
- `GET /api/v1/dashboard/status` - System status overview
- `GET /api/v1/dashboard/metrics` - Performance metrics
- `GET /api/v1/dashboard/health` - Health status

### System Information
- `GET /api/v1/system/info` - System details
- `GET /api/v1/system/boot` - Boot settings
- `POST /api/v1/system/reset` - System reset
- `POST /api/v1/system/power/{action}` - Power control

### Sensors & Monitoring
- `GET /api/v1/sensors` - List all sensors
- `GET /api/v1/sensors/temperature` - Temperature sensors
- `GET /api/v1/sensors/fans` - Fan sensors
- `GET /api/v1/sensors/power` - Power sensors

### Storage & Inventory
- `GET /api/v1/storage` - Storage overview
- `GET /api/v1/storage/drives` - Storage drives
- `GET /api/v1/inventory/processors` - Processor info
- `GET /api/v1/inventory/memory` - Memory modules
- `GET /api/v1/inventory/network` - Network devices

### Firmware
- `GET /api/v1/firmware/inventory` - Firmware versions
- `POST /api/v1/firmware/update` - Firmware update
- `GET /api/v1/firmware/update-status` - Update status

### Events & Logs
- `GET /api/v1/events` - System events
- `GET /api/v1/logs/sel` - SEL logs
- `GET /api/v1/logs/audit` - Audit logs

## 🧪 Testing

Run the complete test suite:

```bash
cd backend
pytest tests/ -v --cov=app --cov-report=html
```

**Test Coverage:**
- Unit tests for all services
- Integration tests for API endpoints
- Mock Redfish API tests
- Database tests
- Authentication tests

## 📚 Documentation

- **[API Documentation](docs/API.md)** - Complete API reference
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design
- **[Installation Guide](docs/INSTALLATION.md)** - Detailed setup
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Developer Guide](docs/DEVELOPER.md)** - Development workflow

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build images
docker-compose -f docker-compose.yml build

# Start services
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**
- Backend API (FastAPI): Port 8000
- Frontend (React): Port 3000
- NGINX Reverse Proxy: Port 80, 443
- SQLite Database: Persistent volume

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Operator, Viewer roles
- **Password Hashing**: bcrypt with salt
- **HTTPS Support**: SSL/TLS certificates
- **CORS Protection**: Cross-origin request filtering
- **Rate Limiting**: API request throttling
- **Input Validation**: Pydantic schema validation
- **Secure Headers**: HSTS, CSP, X-Frame-Options
- **Audit Logging**: Complete activity tracking

## 📝 Logging

The platform includes comprehensive logging:

- **Application Logs**: Core application events
- **API Logs**: Request/response tracking
- **Audit Logs**: User action history
- **Redfish Logs**: BMC API interactions
- **Error Logs**: Exception tracking

Log files location: `./logs/`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📋 Development Workflow

```bash
# Install pre-commit hooks
pre-commit install

# Run linting
make lint

# Format code
make format

# Run tests
make test

# Build Docker images
make docker-build

# Start development environment
make dev-up
```

## 📄 License

This project is licensed under the Apache License 2.0 - see [LICENSE](LICENSE) file for details.

## 🙋 Support

- **Documentation**: See `/docs` directory
- **Issues**: [GitHub Issues](https://github.com/CyberJana/openbmc-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CyberJana/openbmc-platform/discussions)

## 👥 Authors

- Senior Firmware Engineer
- Embedded Linux Engineer
- Python Backend Developer
- OpenBMC Expert

## 🔗 Resources

- [OpenBMC Documentation](https://github.com/openbmc/docs)
- [Redfish API Standard](https://www.dmtf.org/standards/redfish)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## ⭐ Show Your Support

If you find this project helpful, please give it a star! Your support helps drive development.

--

**Last Updated**: 2026-07-19
**Version**: 1.0.0
**Status**: Production Ready