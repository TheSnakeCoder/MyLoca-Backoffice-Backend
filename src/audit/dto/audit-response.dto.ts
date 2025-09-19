import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction, AuditStatus } from '../../../generated/prisma';

/**
 * @fileoverview Audit Log Response DTOs
 * 
 * This file contains Data Transfer Objects (DTOs) for audit log API responses.
 * These DTOs define the structure and documentation for all audit endpoint responses.
 * 
 * @module AuditResponseDTOs
 */

/**
 * Basic admin information for audit log entries
 * 
 * @class AdminInfoDto
 * @description Minimal admin details included in audit logs for identification
 */
export class AdminInfoDto {
  @ApiProperty({
    description: 'Unique admin identifier',
    example: 'admin_123',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Admin username for human-readable identification',
    example: 'admin1',
    type: String,
  })
  username: string;
}

export class AuditLogDto {
  @ApiProperty({
    description: 'Audit log ID',
    example: 'audit_123',
  })
  id: string;

  @ApiProperty({
    description: 'Admin ID who performed the action',
    example: 'admin_456',
  })
  adminId: string;

  @ApiProperty({
    description: 'Action performed',
    enum: AuditAction,
    example: AuditAction.LOGIN,
  })
  action: AuditAction;

  @ApiProperty({
    description: 'Resource type affected',
    example: 'auth',
  })
  resource: string;

  @ApiPropertyOptional({
    description: 'ID of the affected resource (if applicable)',
    example: 'user_789',
  })
  resourceId?: string;

  @ApiProperty({
    description: 'HTTP method used',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'API endpoint called',
    example: '/auth/login',
  })
  endpoint: string;

  @ApiPropertyOptional({
    description: 'Additional details about the action',
    example: {
      username: 'admin1',
      responseTime: 245
    },
  })
  details?: any;

  @ApiPropertyOptional({
    description: 'Metadata like IP, user agent, etc.',
    example: {
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      timestamp: '2024-09-07T21:45:30.000Z'
    },
  })
  metadata?: any;

  @ApiProperty({
    description: 'Status of the action',
    enum: AuditStatus,
    example: AuditStatus.SUCCESS,
  })
  status: AuditStatus;

  @ApiPropertyOptional({
    description: 'Error message if action failed',
    example: 'Invalid credentials',
  })
  errorMessage?: string;

  @ApiProperty({
    description: 'Timestamp when the action occurred',
    example: '2024-09-07T21:45:30.000Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Whether this log entry is archived',
    example: false,
  })
  isArchived: boolean;

  @ApiPropertyOptional({
    description: 'When this log entry was archived',
    example: '2024-09-07T21:45:30.000Z',
  })
  archivedAt?: Date;

  @ApiPropertyOptional({
    description: 'Admin who archived this log entry',
    example: 'admin_123',
  })
  archivedBy?: string;

  @ApiProperty({
    description: 'Admin who performed the action',
    type: AdminInfoDto,
  })
  admin: AdminInfoDto;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 50,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  pages: number;
}

export class AuditMetadataDto {
  @ApiProperty({
    description: 'Whether archived logs are included in the results',
    example: false,
  })
  includeArchived: boolean;

  @ApiProperty({
    description: 'Number of archived logs matching the filter',
    example: 150,
  })
  archivedCount: number;

  @ApiProperty({
    description: 'Number of active (non-archived) logs matching the filter',
    example: 300,
  })
  activeCount: number;
}

export class AuditLogsResponseDto {
  @ApiProperty({
    description: 'Array of audit log entries',
    type: [AuditLogDto],
  })
  logs: AuditLogDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;

  @ApiPropertyOptional({
    description: 'Additional metadata about the audit logs',
    type: AuditMetadataDto,
  })
  metadata?: AuditMetadataDto;
}

export class ActionTypeCountDto {
  @ApiProperty({
    description: 'Action type',
    example: 'LOGIN',
  })
  action: string;

  @ApiProperty({
    description: 'Number of occurrences',
    example: 25,
  })
  count: number;
}

export class StatusCountDto {
  @ApiProperty({
    description: 'Status type',
    example: 'SUCCESS',
  })
  status: string;

  @ApiProperty({
    description: 'Number of occurrences',
    example: 95,
  })
  count: number;
}

export class ResourceCountDto {
  @ApiProperty({
    description: 'Resource type',
    example: 'auth',
  })
  resource: string;

  @ApiProperty({
    description: 'Number of occurrences',
    example: 42,
  })
  count: number;
}

export class AuditStatsResponseDto {
  @ApiProperty({
    description: 'Total number of actions in the period',
    example: 1250,
  })
  totalActions: number;

  @ApiProperty({
    description: 'Actions grouped by type',
    type: [ActionTypeCountDto],
  })
  actionsByType: ActionTypeCountDto[];

  @ApiProperty({
    description: 'Actions grouped by status',
    type: [StatusCountDto],
  })
  actionsByStatus: StatusCountDto[];

  @ApiProperty({
    description: 'Actions grouped by resource',
    type: [ResourceCountDto],
  })
  actionsByResource: ResourceCountDto[];

  @ApiProperty({
    description: 'Recent activity (last 24 hours)',
    type: [AuditLogDto],
  })
  recentActivity: AuditLogDto[];

  @ApiProperty({
    description: 'Time period analyzed',
    example: 'Last 30 days',
  })
  period: string;
}

export class AdminActivityResponseDto {
  @ApiProperty({
    description: 'Total number of actions by the admin',
    example: 125,
  })
  totalActions: number;

  @ApiProperty({
    description: 'Actions grouped by type',
    example: {
      LOGIN: 15,
      LIST_USERS: 45,
      VIEW_DASHBOARD: 25
    },
  })
  actionsByType: Record<string, number>;

  @ApiProperty({
    description: 'Actions grouped by resource',
    example: {
      auth: 20,
      user: 50,
      dashboard: 25
    },
  })
  actionsByResource: Record<string, number>;

  @ApiProperty({
    description: 'Actions grouped by status',
    example: {
      SUCCESS: 120,
      FAILED: 5
    },
  })
  actionsByStatus: Record<string, number>;

  @ApiProperty({
    description: 'Recent actions by the admin',
    type: [AuditLogDto],
  })
  recentActions: AuditLogDto[];

  @ApiProperty({
    description: 'Time period analyzed',
    example: 'Last 30 days',
  })
  period: string;
}

export class ArchiveResponseDto {
  @ApiProperty({
    description: 'Number of audit logs archived',
    example: 2500,
  })
  archivedCount: number;

  @ApiProperty({
    description: 'Archive operation message',
    example: 'Successfully archived 2500 audit logs older than 365 days. Records preserved for compliance.',
  })
  message: string;
}

// Keep CleanupResponseDto for backward compatibility but mark as deprecated
export class CleanupResponseDto {
  @ApiProperty({
    description: 'Number of audit logs processed (archived, not deleted)',
    example: 2500,
  })
  deletedCount: number; // Keep name for compatibility

  @ApiProperty({
    description: 'Operation message',
    example: 'Successfully archived 2500 audit logs older than 365 days. Records preserved for compliance.',
  })
  message: string;
}
