import { ApiProperty } from '@nestjs/swagger';

// Common schema classes for Swagger documentation

export class PaginationSchema {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 150 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 8 })
  totalPages: number;
}

export class PaginatedResponseSchema<T> {
  @ApiProperty({ description: 'Array of data items' })
  data: T[];

  @ApiProperty({ type: PaginationSchema, description: 'Pagination information' })
  pagination: PaginationSchema;
}

export class SuccessMessageSchema {
  @ApiProperty({ description: 'Success message', example: 'Operation completed successfully' })
  message: string;
}

export class ErrorResponseSchema {
  @ApiProperty({ description: 'HTTP status code', example: 400 })
  statusCode: number;

  @ApiProperty({ 
    description: 'Error message or array of validation errors',
    oneOf: [
      { type: 'string', example: 'Bad Request' },
      { type: 'array', items: { type: 'string' }, example: ['field is required'] }
    ]
  })
  message: string | string[];

  @ApiProperty({ description: 'Error type', example: 'Bad Request' })
  error: string;
}

export class HealthStatusSchema {
  @ApiProperty({ 
    description: 'Health status',
    enum: ['HEALTHY', 'DEGRADED', 'DOWN', 'UNKNOWN'],
    example: 'HEALTHY'
  })
  status: string;

  @ApiProperty({ description: 'Timestamp of health check', example: '2024-01-20T10:30:00Z' })
  timestamp: string;

  @ApiProperty({ description: 'System uptime in seconds', example: 86400 })
  uptime: number;
}

export class MetricsSchema {
  @ApiProperty({ description: 'Average response time in milliseconds', example: 52 })
  avgResponseTime: number;

  @ApiProperty({ description: 'Number of requests in the time period', example: 120 })
  requestCount: number;

  @ApiProperty({ description: 'Number of errors in the time period', example: 2 })
  errorCount: number;

  @ApiProperty({ description: 'Success rate as percentage', example: 98.33 })
  successRate: number;

  @ApiProperty({ description: 'Memory usage in MB', example: 256, required: false })
  memoryUsage?: number;

  @ApiProperty({ description: 'CPU usage as percentage', example: 15.5, required: false })
  cpuUsage?: number;
}

export class AuditMetadataSchema {
  [key: string]: any;
}

export class LocationCoordinatesSchema {
  @ApiProperty({ description: 'Latitude coordinate', example: 40.7128 })
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate', example: -74.0060 })
  longitude: number;

  @ApiProperty({ description: 'Location accuracy in meters', example: 5.0 })
  accuracy: number;
}

export class UserSummarySchema {
  @ApiProperty({ description: 'User identifier', example: 'clr123xyz789' })
  id: string;

  @ApiProperty({ description: 'Username', example: 'john_doe' })
  username: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'User active status', example: true })
  isActive: boolean;
}

export class DashboardStatsSchema {
  @ApiProperty({ 
    description: 'User statistics',
    example: {
      total: 15420,
      active: 12350,
      new: 245,
      growth: 12.5
    }
  })
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };

  @ApiProperty({
    description: 'Location statistics',
    example: {
      total: 89560,
      active: 3420,
      cached: 1250,
      avgResponseTime: 45
    }
  })
  locations: {
    total: number;
    active: number;
    cached: number;
    avgResponseTime: number;
  };

  @ApiProperty({
    description: 'Friendship statistics',
    example: {
      total: 45230,
      pending: 1520,
      accepted: 43710,
      blocked: 340
    }
  })
  friendships: {
    total: number;
    pending: number;
    accepted: number;
    blocked: number;
  };

  @ApiProperty({
    description: 'System statistics',
    example: {
      uptime: 2592000,
      status: 'HEALTHY',
      lastCheck: '2024-01-20T10:30:00Z'
    }
  })
  system: {
    uptime: number;
    status: string;
    lastCheck: string;
  };
}

export class TrendDataSchema {
  @ApiProperty({ description: 'Timestamp of data point', example: '2024-01-20T10:30:00Z' })
  timestamp: string;

  @ApiProperty({ description: 'Value at this timestamp', example: 98.5 })
  value: number;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: Record<string, any>;
}
