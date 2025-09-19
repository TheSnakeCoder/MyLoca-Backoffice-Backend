# Audit Module Swagger Documentation

This directory contains the organized Swagger/OpenAPI documentation for the audit module endpoints.

## 📁 File Structure

```
src/audit/swagger/
├── audit.swagger.ts     # Main Swagger decorators for audit endpoints
├── index.ts            # Barrel export file with documentation
└── README.md           # This documentation file
```

## 🎯 Purpose

This organization separates Swagger documentation from controller logic, providing:

- **Cleaner Controllers**: Business logic separated from documentation
- **Reusable Decorators**: Consistent documentation patterns
- **Better Maintainability**: Centralized API documentation
- **Enhanced Developer Experience**: Rich, detailed API docs

## 🚀 Usage

### In Controllers

```typescript
import {
  ApiAuditController,
  ApiGetAuditLogs,
  ApiGetAuditStats,
} from './swagger';

@ApiAuditController()
@Controller('audit')
export class AuditController {
  
  @Get('logs')
  @ApiGetAuditLogs()
  async getAuditLogs(@Query() query: AuditLogQueryDto) {
    // Implementation
  }
}
```

### Available Decorators

#### Controller Decorators
- `@ApiAuditController()` - Common decorators for all audit endpoints

#### Endpoint Decorators
- `@ApiGetAuditLogs()` - GET /audit/logs
- `@ApiGetAuditStats()` - GET /audit/stats  
- `@ApiGetAdminActivity()` - GET /audit/admin/:id/activity
- `@ApiArchiveAuditLogs()` - GET /audit/archive
- `@ApiGetAllAuditLogs()` - GET /audit/logs/all
- `@ApiCleanupAuditLogs()` - GET /audit/cleanup (deprecated)

#### Query Parameter Decorators
- `@ApiAuditLogQuery()` - Common filtering parameters
- `@ApiStatsQuery()` - Statistics query parameters
- `@ApiActivityQuery()` - Activity query parameters
- `@ApiArchiveQuery()` - Archive operation parameters

## 📊 Documentation Features

### Comprehensive Examples
Each endpoint includes:
- Detailed descriptions with security notes
- Complete request/response examples
- Error response documentation
- Parameter validation rules

### Security Documentation
- JWT Bearer authentication requirements
- Admin privilege verification
- Audit trail logging information
- Compliance and security notices

### Response Schemas
- Structured response DTOs with examples
- Pagination metadata
- Error response formats
- Status code documentation

## 🔧 Maintenance

### Adding New Endpoints

1. **Create Swagger Decorator**:
```typescript
export const ApiNewEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'New endpoint',
      description: 'Detailed description...',
    }),
    ApiResponse({
      status: 200,
      description: 'Success response',
      type: ResponseDto,
    }),
  );
```

2. **Update Index File**:
```typescript
export * from './audit.swagger';
// Add new exports
```

3. **Use in Controller**:
```typescript
@Get('new-endpoint')
@ApiNewEndpoint()
async newEndpoint() {
  // Implementation
}
```

### Best Practices

1. **Descriptive Documentation**: Include use cases and security implications
2. **Complete Examples**: Provide realistic request/response examples
3. **Error Handling**: Document all possible error responses
4. **Security Notes**: Always include authentication and authorization details
5. **Compliance Info**: Add compliance and audit trail information

## 🛡️ Security Features

The audit documentation emphasizes:

- **Authentication Required**: All endpoints require JWT tokens
- **Admin Access**: Admin privileges verification
- **Audit Logging**: All access attempts are logged
- **Compliance**: Regulatory requirement documentation
- **Data Protection**: Security best practices

## 📈 Benefits

### For Developers
- **Cleaner Code**: Separation of concerns
- **Faster Development**: Reusable documentation patterns
- **Better Testing**: Clear API contracts

### For API Consumers
- **Rich Documentation**: Comprehensive endpoint descriptions
- **Interactive Testing**: Swagger UI integration
- **Error Guidance**: Clear error response documentation

### for Maintenance
- **Centralized Docs**: Single source of truth
- **Version Control**: Easy documentation updates
- **Consistency**: Standardized documentation patterns

## 🔄 Integration

This documentation integrates with:

- **NestJS Swagger**: Automatic OpenAPI generation
- **Swagger UI**: Interactive API documentation
- **DTOs**: Type-safe request/response validation
- **Auth Guards**: Security requirement enforcement

## 📝 Notes

- All decorators include comprehensive error documentation
- Security implications are clearly documented
- Compliance requirements are emphasized
- Deprecated endpoints are properly marked
- Examples reflect real-world usage patterns
