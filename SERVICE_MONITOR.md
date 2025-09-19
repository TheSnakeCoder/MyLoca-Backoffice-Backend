# Service Monitor System

A comprehensive service monitoring system that analyzes the whole architecture and all used services with automated actions.

## Features

- **Real-time Health Monitoring**: Continuous monitoring of all system services
- **Automated Actions**: Automatic restart and alerting when services fail
- **Performance Metrics**: Response time, uptime, and error rate tracking
- **Historical Data**: Service health history and trends
- **RESTful API**: Complete API for integration with dashboards
- **Configurable Alerting**: Multiple notification channels

## Monitored Services

1. **PostgreSQL Database**
   - Connection health
   - Query performance
   - Database metrics

2. **MyLoca External API**
   - API connectivity
   - Endpoint availability
   - Cache status

3. **Internal Services**
   - JWT configuration
   - Prisma ORM
   - Environment variables
   - Admin access
   - Audit system

## API Endpoints

### Health Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/service-monitor/health` | Get overall system health |
| `GET` | `/service-monitor/health/:serviceName` | Get specific service health |
| `POST` | `/service-monitor/health/check` | Trigger manual health check |

### Metrics & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/service-monitor/metrics` | Get service performance metrics |
| `GET` | `/service-monitor/history/:serviceName` | Get service health history |
| `GET` | `/service-monitor/health-trends` | Get health trends for charts |

### Configuration

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/service-monitor/config` | Get monitoring configuration |
| `PUT` | `/service-monitor/config` | Update monitoring configuration |
| `GET` | `/service-monitor/services` | Get list of monitored services |
| `GET` | `/service-monitor/actions` | Get available auto actions |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/service-monitor/dashboard` | Get complete dashboard data |
| `GET` | `/service-monitor/status-summary` | Get quick status summary |

## Automated Actions

### Alert Notification Action
- **Trigger**: When services have issues (DOWN, DEGRADED, UNKNOWN)
- **Behavior**: Sends alerts requiring manual intervention
- **Channels**:
  - Log alerts (always available)
  - Email notifications (configurable)
  - Slack alerts (configurable)
- **Note**: Manual restart required - no automatic service restart is performed

## Configuration

Environment variables in `.env`:

```bash
# Service Monitoring Configuration
MONITORING_ENABLED=true                    # Enable/disable monitoring
MONITORING_CHECK_INTERVAL=60               # Check interval in seconds
MONITORING_RETRY_ATTEMPTS=3                # Retry attempts for failed checks
MONITORING_TIMEOUT=30000                   # Timeout for health checks
MONITORING_ALERTING_ENABLED=true           # Enable alerting
MONITORING_RESPONSE_TIME_THRESHOLD=5000    # Response time threshold (ms)
MONITORING_ERROR_RATE_THRESHOLD=10         # Error rate threshold (%)
MONITORING_UPTIME_THRESHOLD=95             # Uptime threshold (%)
MONITORING_AUTO_ACTIONS_ENABLED=true       # Enable auto actions
MONITORING_AUTO_ACTIONS="alert"            # Available actions (restart removed)
```

## Usage Examples

### Get System Health
```bash
GET /service-monitor/health
Authorization: Bearer <jwt-token>
```

Response:
```json
{
  "overallStatus": "HEALTHY",
  "services": [
    {
      "serviceName": "PostgreSQL Database",
      "serviceType": "DATABASE",
      "status": "HEALTHY",
      "message": "Database connection successful",
      "responseTime": 45,
      "lastChecked": "2024-01-20T10:30:00Z"
    }
  ],
  "totalServices": 3,
  "healthyServices": 3,
  "degradedServices": 0,
  "downServices": 0,
  "systemUptime": 86400,
  "lastFullCheck": "2024-01-20T10:30:00Z"
}
```

### Get Service Metrics
```bash
GET /service-monitor/metrics
Authorization: Bearer <jwt-token>
```

Response:
```json
[
  {
    "serviceName": "PostgreSQL Database",
    "avgResponseTime": 52,
    "requestCount": 120,
    "errorCount": 2,
    "successRate": 98.33
  }
]
```

### Trigger Manual Health Check
```bash
POST /service-monitor/health/check
Authorization: Bearer <jwt-token>
```

## Scheduled Tasks

- **Health Check**: Runs every minute (configurable)
- **Auto Actions**: Triggered when issues detected
- **History Cleanup**: Maintains last 100 entries per service

## Integration

The service monitor is automatically integrated into your application through:

1. **Module Import**: Added to `AppModule`
2. **Scheduled Tasks**: Automatic background monitoring
3. **JWT Protection**: All endpoints require authentication
4. **Swagger Documentation**: API docs available at `/api`

## Extending the System

### Adding New Service Checkers

1. Implement `IServiceChecker` interface
2. Register in `ServiceMonitorModule`
3. Add to `ServiceMonitorService`

### Adding New Auto Actions

1. Implement `IAutoAction` interface
2. Register in `ServiceMonitorModule`
3. Configure trigger conditions

## Monitoring Dashboard Integration

The API provides all necessary endpoints for building monitoring dashboards with:

- Real-time status indicators
- Health trend charts
- Performance metrics
- Alert management
- Configuration controls

All endpoints return structured JSON data suitable for frontend frameworks like React, Vue, or Angular.
