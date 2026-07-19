# Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Web Browser  │  │  Mobile App  │  │  REST Client │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         └────────────────┬──────────────────┘                    │
└─────────────────────────┼────────────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────┼────────────────────────────────────────┐
│                    API Gateway Layer                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              NGINX Reverse Proxy                           │ │
│  │  - SSL/TLS Termination                                    │ │
│  │  - Load Balancing                                         │ │
│  │  - Rate Limiting                                          │ │
│  │  - Security Headers                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────┬────────────────────────────────────────┘
                          │ HTTP
┌─────────────────────────┼────────────────────────────────────────┐
│              Application Layer (FastAPI Backend)                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               Middleware Stack                            │ │
│  │  - Authentication (JWT)                                   │ │
│  │  - Authorization (RBAC)                                   │ │
│  │  - Request/Response Logging                               │ │
│  │  - Error Handling                                         │ │
│  │  - Request ID Tracking                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   API Route Handlers                       │ │
│  │  ┌──────────────┬──────────────┬──────────────┐           │ │
│  │  │    Auth      │    Users     │   Systems    │           │ │
│  │  │  Endpoints   │  Endpoints   │  Endpoints   │           │ │
│  │  └──────────────┴──────────────┴──────────────┘           │ │
│  │  ┌──────────────┬──────────────┬──────────────┐           │ │
│  │  │  Dashboard   │    Events    │   Sensors    │           │ │
│  │  │  Endpoints   │  Endpoints   │  Endpoints   │           │ │
│  │  └──────────────┴──────────────┴──────────────┘           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Service Layer                           │ │
│  │  ┌───────────────────────────────────────────────────────┐ │ │
│  │  │ Authentication │ User Management │ BMC Management    │ │ │
│  │  ├───────────────────────────────────────────────────────┤ │ │
│  │  │ Sensor Service │ Event Service │ Firmware Service  │ │ │
│  │  ├───────────────────────────────────────────────────────┤ │ │
│  │  │ Redfish Client │ Dashboard Service │ Health Service │ │ │
│  │  └───────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────┬────────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────────┐
│              Data Layer (SQLAlchemy ORM)                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   ORM Models                              │ │
│  │  ┌────────────┬────────────┬────────────┬────────────┐   │ │
│  │  │   User     │   Role     │ Permission │   Audit    │   │ │
│  │  ├────────────┼────────────┼────────────┼────────────┤   │ │
│  │  │BMCSystem   │  Sensor    │   Event    │ Firmware   │   │ │
│  │  ├────────────┼────────────┼────────────┼────────────┤   │ │
│  │  │ Storage    │ Network    │ Inventory  │   Power    │   │ │
│  │  ├────────────┼────────────┼────────────┼────────────┤   │ │
│  │  │ Thermal    │ Session    │            │            │   │ │
│  │  └────────────┴────────────┴────────────┴────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────┬────────────────────────────────────────┘
                          │ SQL
┌─────────────────────────┼────────────────────────────────────────┐
│                 Database Layer                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          SQLite (Dev) / PostgreSQL (Prod)                 │ │
│  │  - Transaction Management                                 │ │
│  │  - Connection Pooling                                     │ │
│  │  - Backup & Recovery                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────┬────────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────────┐
│              External Systems Integration                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Redfish API Client                           │ │
│  │  - HTTP/HTTPS Communication                              │ │
│  │  - Session Management                                     │ │
│  │  - Automatic Retry Logic                                  │ │
│  │  - Error Handling                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          │                                       │
│                    ┌─────▼──────┐                                │
│                    │ BMC Systems│                                │
│                    │ (Redfish)  │                                │
│                    └────────────┘                                │
└──────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend (React TypeScript)

```
src/
├── components/       # Reusable UI components
│   ├── Auth/       # Authentication components
│   ├── Dashboard/  # Dashboard components
│   ├── Systems/    # BMC system components
│   └── Common/     # Common UI components
├── pages/          # Page components
│   ├── Login
│   ├── Dashboard
│   ├── Systems
│   └── Settings
├── hooks/          # Custom React hooks
│   ├── useAuth
│   ├── useFetch
│   └── useNotification
├── services/       # API client services
│   ├── api.ts
│   ├── auth.ts
│   └── systems.ts
├── assets/         # Static files
└── App.tsx         # Root component
```

### Backend (FastAPI Python)

```
app/
├── api/            # API endpoints
│   └── endpoints/
│       ├── auth.py
│       ├── users.py
│       ├── systems.py
│       ├── dashboard.py
│       └── sensors.py
├── models/         # SQLAlchemy models
│   ├── user.py
│   ├── bmc_system.py
│   ├── sensor.py
│   └── ...
├── schemas/        # Pydantic schemas
│   ├── user.py
│   ├── bmc_system.py
│   └── ...
├── services/       # Business logic
│   ├── auth_service.py
│   ├── user_service.py
│   ├── bmc_service.py
│   ├── redfish_service.py
│   └── ...
├── database/       # Database configuration
│   └── session.py
├── middleware/     # Custom middleware
│   ├── auth.py
│   └── error_handler.py
├── core/           # Core configuration
│   ├── config.py
│   ├── security.py
│   └── logger.py
└── main.py         # Application entry point
```

## Data Flow

### Authentication Flow

```
1. User enters credentials
2. Frontend sends POST /api/v1/auth/login
3. Backend verifies credentials
4. Backend generates JWT tokens
5. Backend returns tokens to frontend
6. Frontend stores tokens (secure storage)
7. Frontend includes token in Authorization header for subsequent requests
8. Middleware verifies token
9. Request proceeds to handler
```

### BMC System Monitoring Flow

```
1. User creates BMC system entry via API
2. System credentials stored in database (encrypted)
3. Frontend requests dashboard data
4. Dashboard service creates Redfish client
5. Redfish client connects to BMC
6. BMC authenticates connection
7. Redfish client queries endpoints:
   - /Systems for CPU/Memory
   - /Chassis/Thermal for temps
   - /Chassis/Power for power data
8. Data parsed and stored in database
9. Dashboard service formats response
10. Frontend receives and displays data
11. Charts update with real-time data
```

### User Management Flow

```
1. Admin creates new user via API
2. Password hashed with bcrypt
3. User record stored in database
4. Email sent to user
5. User logs in with credentials
6. Tokens generated and returned
7. User can now access protected resources
8. JWT middleware validates token on each request
```

## Database Schema

### Core Tables

- **users**: User accounts and credentials
- **roles**: User roles (admin, operator, viewer)
- **permissions**: Fine-grained permissions
- **audit_logs**: User action tracking

### BMC Management Tables

- **bmc_systems**: BMC system configurations
- **sensors**: Hardware sensor readings
- **events**: System events and alerts
- **firmware**: Firmware information

### Infrastructure Tables

- **storage**: Storage device information
- **network_interfaces**: Network configuration
- **inventory**: System components
- **power**: Power supply information
- **thermal**: Temperature and fan data
- **session_tokens**: Active user sessions

## Deployment Architecture

### Development (Docker Compose)

```
DockerHost
├── Backend Container (FastAPI)
├── Frontend Container (React)
├── Database Container (SQLite)
└── NGINX Container (Reverse Proxy)
```

### Production (Kubernetes)

```
Kubernetes Cluster
├── Namespace: openbmc
├── Deployments:
│   ├── Backend (3 replicas)
│   ├── Frontend (2 replicas)
│   └── NGINX Ingress
├── Services:
│   ├── Backend Service (ClusterIP)
│   ├── Frontend Service (ClusterIP)
│   └── Database Service (ClusterIP)
├── PersistentVolumes:
│   ├── Database storage
│   └── Logs storage
└── ConfigMaps & Secrets:
    ├── Configuration
    └── Credentials
```

## Security Architecture

### Authentication & Authorization

- JWT tokens for stateless authentication
- Role-Based Access Control (RBAC)
- Session management with token revocation
- Password hashing with bcrypt

### Data Protection

- TLS/SSL for transit encryption
- Database encryption at rest
- Secure credential storage
- Audit logging of all operations

### API Security

- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention (ORM)
- CSRF protection
- Secure headers

## Scalability Considerations

### Horizontal Scaling

- Stateless backend services
- Load balancer distribution
- Database connection pooling
- Caching layer (Redis)

### Vertical Scaling

- Resource allocation optimization
- Database query optimization
- Index creation for frequent queries
- Connection pooling tuning

## Performance Optimization

### Backend

- Async/await for I/O operations
- Connection pooling
- Query result caching
- Batch operations

### Frontend

- Code splitting
- Lazy loading
- Component memoization
- Efficient state management

### Database

- Indexing strategy
- Query optimization
- Partition strategies
- Archive old data

## Monitoring & Observability

### Metrics

- API response times
- Database query performance
- Error rates
- System resource usage
- User activity

### Logging

- Application logs
- API request/response logs
- Audit logs
- Error logs
- Performance logs

### Alerting

- High error rates
- Slow response times
- Database connection issues
- Resource exhaustion
- Security events

## High Availability

### Redundancy

- Multiple backend instances
- Database replication
- Load balancer failover
- Backup systems

### Disaster Recovery

- Automated backups
- Point-in-time recovery
- Backup verification
- Recovery testing

## References

- [FastAPI Architecture](https://fastapi.tiangolo.com/)
- [React Architecture](https://react.dev/)
- [SQLAlchemy ORM](https://www.sqlalchemy.org/)
- [Redfish API](https://www.dmtf.org/standards/redfish)