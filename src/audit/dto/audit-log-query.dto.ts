import { IsOptional, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction, AuditStatus } from '../../../generated/prisma';

/**
 * @fileoverview Audit Log Query DTOs
 * 
 * This file contains Data Transfer Objects (DTOs) for audit log queries and filtering.
 * These DTOs provide validation, transformation, and API documentation for audit endpoints.
 * 
 * @module AuditQueryDTOs
 */

/**
 * Query parameters for filtering and paginating audit logs
 * 
 * @class AuditLogQueryDto
 * @description Comprehensive filtering options for audit log retrieval with validation
 */
export class AuditLogQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by admin ID - only show logs for a specific admin user',
    example: 'admin_123',
    type: String,
  })
  @IsOptional()
  adminId?: string;

  @ApiPropertyOptional({
    description: 'Filter by action type',
    enum: AuditAction,
    example: AuditAction.LOGIN,
  })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiPropertyOptional({
    description: 'Filter by resource type',
    example: 'auth',
  })
  @IsOptional()
  resource?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: AuditStatus,
    example: AuditStatus.SUCCESS,
  })
  @IsOptional()
  @IsEnum(AuditStatus)
  status?: AuditStatus;

  @ApiPropertyOptional({
    description: 'Start date filter (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date filter (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}

/**
 * Query parameters for audit statistics and analytics
 * 
 * @class AuditStatsQueryDto
 * @description Configure time period and scope for audit statistics generation
 */
export class AuditStatsQueryDto {
  @ApiPropertyOptional({
    description: 'Number of days to analyze for statistics (1-365 days)',
    example: 30,
    minimum: 1,
    maximum: 365,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number = 30;

  @ApiPropertyOptional({
    description: 'Filter statistics by specific admin ID (optional)',
    example: 'admin_123',
    type: String,
  })
  @IsOptional()
  adminId?: string;
}

/**
 * Query parameters for individual admin activity analysis
 * 
 * @class AdminActivityQueryDto
 * @description Configure time period for analyzing specific admin user activity
 */
export class AdminActivityQueryDto {
  @ApiPropertyOptional({
    description: 'Number of days to analyze for admin activity (1-365 days)',
    example: 30,
    minimum: 1,
    maximum: 365,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number = 30;
}

/**
 * Query parameters for audit log archiving operations
 * 
 * @class CleanupQueryDto
 * @description Configure retention period for archiving old audit logs (compliance-safe)
 * @deprecated Name suggests deletion but operation only archives logs
 */
export class CleanupQueryDto {
  @ApiPropertyOptional({
    description: 'Retention period in days before archiving (30 days to 10 years)',
    example: 365,
    minimum: 30,
    maximum: 3650,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(30)
  @Max(3650)
  retentionDays?: number = 365;
}

/**
 * Modern DTO for audit log archiving operations
 * 
 * @class ArchiveQueryDto
 * @description Better named alternative to CleanupQueryDto for archiving operations
 */
export class ArchiveQueryDto {
  @ApiPropertyOptional({
    description: 'Retention period in days before archiving (30 days to 10 years)',
    example: 365,
    minimum: 30,
    maximum: 3650,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(30)
  @Max(3650)
  retentionDays?: number = 365;
}
