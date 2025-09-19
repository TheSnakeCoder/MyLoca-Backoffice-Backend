import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

// Common operation decorators for consistent API documentation

export function ApiPaginationQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number for pagination',
      example: 1
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page',
      example: 20
    })
  );
}

export function ApiSearchQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'q',
      required: false,
      type: String,
      description: 'Search query string',
      example: 'john'
    }),
    ApiPaginationQuery()
  );
}

export function ApiDateRangeQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'startDate',
      required: false,
      type: String,
      description: 'Start date for filtering (ISO format)',
      example: '2024-01-01T00:00:00Z'
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      type: String,
      description: 'End date for filtering (ISO format)',
      example: '2024-01-31T23:59:59Z'
    })
  );
}

export function ApiIdParam(description?: string) {
  return ApiParam({
    name: 'id',
    type: String,
    description: description || 'Resource identifier',
    example: 'clr123xyz789'
  });
}

export function ApiUserIdParam() {
  return ApiParam({
    name: 'userId',
    type: String,
    description: 'User identifier',
    example: 'clr123xyz789'
  });
}

export function ApiServiceNameParam() {
  return ApiParam({
    name: 'serviceName',
    type: String,
    description: 'Service name to monitor',
    example: 'PostgreSQL Database'
  });
}

// Dashboard Operations
export function ApiDashboardOperation(summary: string, description?: string) {
  return ApiOperation({
    summary,
    description: description || summary,
    tags: ['Admin Dashboard']
  });
}

// User Management Operations
export function ApiUserOperation(summary: string, description?: string) {
  return ApiOperation({
    summary,
    description: description || summary,
    tags: ['Admin Users']
  });
}

// Friend Management Operations
export function ApiFriendOperation(summary: string, description?: string) {
  return ApiOperation({
    summary,
    description: description || summary,
    tags: ['Admin Friends']
  });
}

// Location Management Operations
export function ApiLocationOperation(summary: string, description?: string) {
  return ApiOperation({
    summary,
    description: description || summary,
    tags: ['Admin Locations']
  });
}

// Service Monitor Operations
export function ApiMonitorOperation(summary: string, description?: string) {
  return ApiOperation({
    summary,
    description: description || summary,
    tags: ['Service Monitor']
  });
}

// Audit Operations
export function ApiAuditOperation(summary: string, description?: string) {
  return ApiOperation({
    summary,
    description: description || summary,
    tags: ['Audit']
  });
}

// Authentication Operations
export function ApiAuthOperation(summary: string, description?: string) {
  return ApiOperation({
    summary,
    description: description || summary,
    tags: ['Authentication']
  });
}

// Generic CRUD Operations
export function ApiGetAllOperation(resource: string) {
  return ApiOperation({
    summary: `Get all ${resource}`,
    description: `Retrieve paginated list of ${resource} with optional filtering`
  });
}

export function ApiGetByIdOperation(resource: string) {
  return ApiOperation({
    summary: `Get ${resource} by ID`,
    description: `Retrieve a specific ${resource} by its identifier`
  });
}

export function ApiCreateOperation(resource: string) {
  return ApiOperation({
    summary: `Create ${resource}`,
    description: `Create a new ${resource} in the system`
  });
}

export function ApiUpdateOperation(resource: string) {
  return ApiOperation({
    summary: `Update ${resource}`,
    description: `Update an existing ${resource} by its identifier`
  });
}

export function ApiDeleteOperation(resource: string) {
  return ApiOperation({
    summary: `Delete ${resource}`,
    description: `Delete an existing ${resource} by its identifier`
  });
}

// Bulk Operations
export function ApiBulkOperation(action: string, resource: string) {
  return ApiOperation({
    summary: `Bulk ${action} ${resource}`,
    description: `Perform ${action} operation on multiple ${resource} at once`
  });
}

// Health Check Operations
export function ApiHealthCheckOperation() {
  return ApiOperation({
    summary: 'Health Check',
    description: 'Check the health status of the application and its dependencies'
  });
}
