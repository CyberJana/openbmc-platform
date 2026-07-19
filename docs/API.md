# API Documentation

## Overview

The OpenBMC Firmware Research Platform API provides comprehensive endpoints for BMC system management, monitoring, and firmware operations. All endpoints are RESTful and return JSON responses.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All endpoints (except login/refresh) require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response

```json
{
  "status": 200,
  "data": {...},
  "message": "Success",
  "timestamp": "2026-07-19T10:30:00Z"
}
```

### Error Response

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Error description",
  "timestamp": "2026-07-19T10:30:00Z"
}
```

## Endpoints

### Authentication

#### Login

```
POST /auth/login
```

Request:
```json
{
  "email": "admin@openbmc.local",
  "password": "OpenBMC@123!"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {...}
}
```

#### Refresh Token

```
POST /auth/refresh
```

Request:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```
POST /auth/logout
```

### Users

#### List Users

```
GET /users?skip=0&limit=100
```

Response:
```json
{
  "total": 5,
  "users": [
    {
      "id": 1,
      "email": "admin@openbmc.local",
      "full_name": "Administrator",
      "is_active": true,
      "is_superadmin": true,
      "created_at": "2026-07-19T10:00:00Z",
      "updated_at": "2026-07-19T10:00:00Z"
    }
  ]
}
```

#### Get User

```
GET /users/{user_id}
```

#### Create User

```
POST /users
```

Request:
```json
{
  "email": "newuser@openbmc.local",
  "full_name": "New User",
  "password": "SecurePassword123!"
}
```

#### Update User

```
PUT /users/{user_id}
```

Request:
```json
{
  "full_name": "Updated Name",
  "password": "NewPassword123!"
}
```

#### Delete User

```
DELETE /users/{user_id}
```

### BMC Systems

#### List BMC Systems

```
GET /systems?skip=0&limit=100
```

#### Get BMC System

```
GET /systems/{system_id}
```

#### Create BMC System

```
POST /systems
```

Request:
```json
{
  "name": "Production BMC",
  "host": "192.168.1.100",
  "port": 443,
  "username": "root",
  "password": "password123",
  "verify_ssl": false
}
```

#### Update BMC System

```
PUT /systems/{system_id}
```

#### Delete BMC System

```
DELETE /systems/{system_id}
```

#### Check System Health

```
POST /systems/{system_id}/health-check
```

Response:
```json
{
  "system_id": 1,
  "health_status": "OK"
}
```

### Dashboard

#### Get Dashboard Status

```
GET /dashboard/status?system_id=1
```

Response:
```json
{
  "bmc_system_id": 1,
  "timestamp": "2026-07-19T10:30:00Z",
  "status": "healthy",
  "message": "System status retrieved successfully"
}
```

#### Get Dashboard Metrics

```
GET /dashboard/metrics?system_id=1
```

Response:
```json
{
  "bmc_system_id": 1,
  "timestamp": "2026-07-19T10:30:00Z",
  "cpu_usage": 45.5,
  "memory_usage": 60.2,
  "temperature_c": 38.5,
  "power_watts": 250.0
}
```

### Sensors

#### List All Sensors

```
GET /sensors?system_id=1&skip=0&limit=100
```

#### Get Temperature Sensors

```
GET /sensors/temperature?system_id=1
```

#### Get Fan Sensors

```
GET /sensors/fans?system_id=1
```

#### Get Power Sensors

```
GET /sensors/power?system_id=1
```

### Events

#### List Events

```
GET /events?system_id=1&skip=0&limit=100&severity=critical
```

#### Get Event Summary

```
GET /events/summary?system_id=1
```

Response:
```json
{
  "system_id": 1,
  "critical_count": 2,
  "warning_count": 5,
  "info_count": 10,
  "total_count": 17
}
```

### Health

#### API Health Check

```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-07-19T10:30:00Z",
  "version": "1.0.0"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

## Rate Limiting

API requests are rate limited to 100 requests per 60 seconds. Check response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1626780000
```

## Pagination

List endpoints support pagination with `skip` and `limit` parameters:

```
GET /users?skip=0&limit=50
```

- `skip`: Number of items to skip (default: 0)
- `limit`: Maximum items to return (default: 100, max: 1000)

## Error Handling

### Validation Error

```json
{
  "status": 422,
  "error": "Validation Error",
  "message": "Validation failed",
  "errors": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

### Authentication Error

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "timestamp": "2026-07-19T10:30:00Z"
}
```

## Redfish API Integration

The platform provides endpoints that internally communicate with BMC systems via Redfish API:

- Service Root: `/api/v1/systems/{id}/redfish/root`
- Systems: `/api/v1/systems/{id}/redfish/systems`
- Chassis: `/api/v1/systems/{id}/redfish/chassis`
- Managers: `/api/v1/systems/{id}/redfish/managers`
- Storage: `/api/v1/systems/{id}/redfish/storage`
- Network: `/api/v1/systems/{id}/redfish/network`

## Examples

### Complete Login Flow

```bash
# 1. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@openbmc.local",
    "password": "OpenBMC@123!"
  }'

# Response includes access_token
# 2. Use token to access protected endpoint
curl -X GET http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer <access_token>"

# 3. Refresh token when expired
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<refresh_token>"}'
```

## WebSocket Support

Real-time updates are available via WebSocket connections:

```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/ws');
ws.onmessage = (event) => {
  console.log('Update received:', JSON.parse(event.data));
};
```

## Versioning

The API uses URL versioning (v1). Future versions will be available at `/api/v2`, etc.

## Support

For API issues or questions:
- Documentation: See docs directory
- Issues: https://github.com/CyberJana/openbmc-platform/issues
- Discussions: https://github.com/CyberJana/openbmc-platform/discussions