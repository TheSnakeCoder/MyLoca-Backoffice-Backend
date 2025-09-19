import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  AuditLogsResponseDto,
  AuditStatsResponseDto,
  AdminActivityResponseDto,
  CleanupResponseDto,
  ArchiveResponseDto,
} from '../dto/audit-response.dto';
import {
  AuditLogQueryDto,
  AuditStatsQueryDto,
  AdminActivityQueryDto,
  CleanupQueryDto,
} from '../dto/audit-log-query.dto';

// Common decorators for all audit endpoints
export const ApiAuditController = () =>
  applyDecorators(
    ApiTags('Audit'),
    ApiBearerAuth('bearer'),
    ApiUnauthorizedResponse({
      description: 'Authentication required - Valid JWT token must be provided',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Authentication failed',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Admin access required - User does not have admin privileges',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden',
          error: 'Admin access required',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Something went wrong',
        },
      },
    }),
  );

// Get audit logs endpoint
export const ApiGetAuditLogs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get audit logs',
      description: `
        Retrieve paginated list of admin audit logs with comprehensive filtering options.
        
        **Features:**
        - Filter by admin ID, action type, resource, and status
        - Date range filtering with ISO 8601 timestamps
        - Pagination with configurable page size (max 100 items per page)
        - Automatic logging of this view action for audit trail
        
        **Security:**
        - Only active (non-archived) logs are returned by default
        - Use /audit/logs/all to include archived logs
        - All access attempts are logged for compliance
      `,
    }),
    ApiResponse({
      status: 200,
      description: 'Audit logs retrieved successfully',
      type: AuditLogsResponseDto,
      schema: {
        example: {
          logs: [
            {
              id: 'audit_123',
              adminId: 'admin_456',
              action: 'LOGIN',
              resource: 'auth',
              resourceId: null,
              method: 'POST',
              endpoint: '/auth/login',
              details: { username: 'admin1', responseTime: 245 },
              metadata: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0...' },
              status: 'SUCCESS',
              errorMessage: null,
              timestamp: '2024-09-07T21:45:30.000Z',
              isArchived: false,
              archivedAt: null,
              archivedBy: null,
              admin: { id: 'admin_456', username: 'admin1' },
            },
          ],
          pagination: { page: 1, limit: 50, total: 150, pages: 3 },
          metadata: { includeArchived: false, archivedCount: 50, activeCount: 100 },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid query parameters',
      schema: {
        example: {
          statusCode: 400,
          message: ['page must be a positive number', 'Invalid date format'],
          error: 'Bad Request',
        },
      },
    }),
  );

// Get audit statistics endpoint
export const ApiGetAuditStats = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get audit statistics',
      description: `
        Retrieve comprehensive audit log statistics and analytics for monitoring and compliance.
        
        **Analytics Include:**
        - Total action counts with time-based analysis
        - Breakdown by action types (LOGIN, CREATE_USER, etc.)
        - Success vs failure rates by status
        - Resource utilization patterns
        - Recent activity trending (last 24 hours)
        
        **Use Cases:**
        - Dashboard metrics and KPIs
        - Compliance reporting
        - Security monitoring and alerting
        - Admin activity analysis
      `,
    }),
    ApiResponse({
      status: 200,
      description: 'Audit statistics retrieved successfully',
      type: AuditStatsResponseDto,
      schema: {
        example: {
          totalActions: 1250,
          actionsByType: [
            { action: 'LOGIN', count: 300 },
            { action: 'LIST_USERS', count: 150 },
            { action: 'VIEW_DASHBOARD', count: 200 },
          ],
          actionsByStatus: [
            { status: 'SUCCESS', count: 1180 },
            { status: 'FAILED', count: 45 },
            { status: 'UNAUTHORIZED', count: 25 },
          ],
          actionsByResource: [
            { resource: 'auth', count: 350 },
            { resource: 'user', count: 400 },
            { resource: 'dashboard', count: 250 },
          ],
          recentActivity: [],
          period: 'Last 30 days',
        },
      },
    }),
  );

// Get admin activity endpoint
export const ApiGetAdminActivity = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get admin activity',
      description: `
        Retrieve detailed activity summary for a specific admin user.
        
        **Activity Metrics:**
        - Total actions performed by the admin
        - Breakdown by action types and frequencies
        - Resource access patterns
        - Success/failure rates
        - Recent activity history
        
        **Compliance Features:**
        - Individual admin audit trails
        - Performance monitoring
        - Security behavior analysis
        - Activity pattern detection
      `,
    }),
    ApiParam({
      name: 'adminId',
      description: 'Unique identifier of the admin user',
      example: 'admin_123',
      schema: { type: 'string' },
    }),
    ApiResponse({
      status: 200,
      description: 'Admin activity retrieved successfully',
      type: AdminActivityResponseDto,
      schema: {
        example: {
          totalActions: 125,
          actionsByType: {
            LOGIN: 15,
            LIST_USERS: 45,
            VIEW_DASHBOARD: 25,
            CREATE_ADMIN: 2,
          },
          actionsByResource: {
            auth: 20,
            user: 50,
            dashboard: 25,
            admin: 5,
          },
          actionsByStatus: {
            SUCCESS: 120,
            FAILED: 5,
          },
          recentActions: [],
          period: 'Last 30 days',
        },
      },
    }),
  );

// Archive audit logs endpoint
export const ApiArchiveAuditLogs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Archive old audit logs',
      description: `
        Archive (NOT delete) audit logs older than the specified retention period for compliance.
        
        **Important Security Features:**
        - Logs are ARCHIVED, never deleted
        - All records preserved for compliance requirements
        - Archiving operation itself is logged
        - Only non-archived logs are processed
        
        **Compliance Benefits:**
        - Maintains complete audit trail
        - Supports regulatory requirements
        - Enables historical analysis
        - Performance optimization without data loss
        
        **Default Retention:** 365 days (configurable from 30 days to 10 years)
      `,
    }),
    ApiResponse({
      status: 200,
      description: 'Archive operation completed successfully',
      type: CleanupResponseDto,
      schema: {
        example: {
          deletedCount: 2500,
          message: 'Successfully archived 2500 audit logs older than 365 days. Records preserved for compliance.',
        },
      },
    }),
  );

// Get all audit logs (including archived)
export const ApiGetAllAuditLogs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all audit logs including archived',
      description: `
        Retrieve ALL audit logs including archived ones for comprehensive compliance reporting.
        
        **Compliance Features:**
        - Complete historical audit trail
        - Includes both active and archived logs
        - Full regulatory compliance support
        - Advanced filtering across all time periods
        
        **Use Cases:**
        - Compliance audits and reporting
        - Historical analysis and investigations
        - Long-term trend analysis
        - Regulatory requirement fulfillment
        
        **Security:** This endpoint provides complete visibility for compliance officers.
      `,
    }),
    ApiResponse({
      status: 200,
      description: 'All audit logs retrieved successfully (including archived)',
      type: AuditLogsResponseDto,
      schema: {
        example: {
          logs: [],
          pagination: { page: 1, limit: 50, total: 3500, pages: 70 },
          metadata: { includeArchived: true, archivedCount: 2500, activeCount: 1000 },
        },
      },
    }),
  );

// Deprecated cleanup endpoint
export const ApiCleanupAuditLogs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'DEPRECATED: Cleanup endpoint disabled',
      description: `
        **⚠️ SECURITY NOTICE: This endpoint is disabled for security and compliance reasons.**
        
        **Why This Endpoint is Disabled:**
        - Audit logs must never be deleted for compliance
        - Regulatory requirements mandate permanent retention
        - Security best practices prohibit audit log deletion
        - Data integrity and tamper-evident logging requirements
        
        **Alternative Solution:**
        Use \`/audit/archive\` endpoint instead for compliance-safe archiving.
        
        **Security Logging:**
        All attempts to access this endpoint are logged as security violations.
      `,
      deprecated: true,
    }),
    ApiResponse({
      status: 403,
      description: 'Operation forbidden - audit logs cannot be deleted',
      schema: {
        example: {
          statusCode: 403,
          message: 'FORBIDDEN: Audit logs cannot be deleted. Use /audit/archive for compliance-safe archiving.',
          error: 'Forbidden',
        },
      },
    }),
  );

// Query decorators for reusable parameters
export const ApiAuditLogQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'adminId',
      required: false,
      description: 'Filter by admin ID',
      example: 'admin_123',
    }),
    ApiQuery({
      name: 'action',
      required: false,
      description: 'Filter by action type',
      enum: [
        'LOGIN',
        'LOGOUT',
        'CREATE_ADMIN',
        'UPDATE_ADMIN',
        'DELETE_ADMIN',
        'VIEW_USER',
        'LIST_USERS',
        'VIEW_DASHBOARD',
        'VIEW_LOGS',
        'ARCHIVE_LOGS',
      ],
    }),
    ApiQuery({
      name: 'resource',
      required: false,
      description: 'Filter by resource type',
      example: 'auth',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filter by status',
      enum: ['SUCCESS', 'FAILED', 'UNAUTHORIZED', 'FORBIDDEN', 'ERROR'],
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      description: 'Start date filter (ISO 8601 format)',
      example: '2024-01-01T00:00:00.000Z',
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      description: 'End date filter (ISO 8601 format)',
      example: '2024-12-31T23:59:59.999Z',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (1-based)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Items per page (max 100)',
      example: 50,
    }),
  );

export const ApiStatsQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'days',
      required: false,
      description: 'Number of days to analyze (1-365)',
      example: 30,
    }),
    ApiQuery({
      name: 'adminId',
      required: false,
      description: 'Filter by specific admin ID',
      example: 'admin_123',
    }),
  );

export const ApiActivityQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'days',
      required: false,
      description: 'Number of days to analyze (1-365)',
      example: 30,
    }),
  );

export const ApiArchiveQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'retentionDays',
      required: false,
      description: 'Retention period in days (30-3650)',
      example: 365,
    }),
  );
