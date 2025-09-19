import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuditService, AuditLogFilters } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditAction, AuditStatus } from '../../generated/prisma';
import {
  AuditLogQueryDto,
  AuditStatsQueryDto,
  AdminActivityQueryDto,
  CleanupQueryDto,
} from './dto/audit-log-query.dto';
import {
  AuditLogsResponseDto,
  AuditStatsResponseDto,
  AdminActivityResponseDto,
  CleanupResponseDto,
} from './dto/audit-response.dto';
import {
  ApiAuditController,
  ApiGetAuditLogs,
  ApiGetAuditStats,
  ApiGetAdminActivity,
  ApiArchiveAuditLogs,
  ApiGetAllAuditLogs,
  ApiCleanupAuditLogs,
} from './swagger';

@Controller('audit')
@UseGuards(JwtAuthGuard)
@ApiAuditController()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiGetAuditLogs()
  async getAuditLogs(@Query() query: AuditLogQueryDto, @Request() req) {
    // Log this action
    await this.auditService.logAdminAction(
      req.user.id,
      AuditAction.VIEW_LOGS,
      'audit',
      req,
    );

    const filters: AuditLogFilters = {
      adminId: query.adminId,
      action: query.action,
      resource: query.resource,
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page || 1,
      limit: query.limit || 50,
    };

    return this.auditService.getAuditLogs(filters);
  }

  @Get('stats')
  @ApiGetAuditStats()
  async getAuditStats(@Query() query: AuditStatsQueryDto, @Request() req) {
    // Log this action
    await this.auditService.logAdminAction(
      req.user.id,
      AuditAction.VIEW_ANALYTICS,
      'audit',
      req,
    );

    const days = query.days || 30;
    const adminId = query.adminId;

    return this.auditService.getAuditStats(adminId, days);
  }

  @Get('admin/:adminId/activity')
  @ApiGetAdminActivity()
  async getAdminActivity(
    @Param('adminId') adminId: string,
    @Request() req,
    @Query() query: AdminActivityQueryDto,
  ) {
    // Log this action
    await this.auditService.logAdminAction(
      req.user.id,
      AuditAction.VIEW_ADMIN,
      'audit',
      req,
      { resourceId: adminId },
    );

    const daysNumber = query.days || 30;
    return this.auditService.getAdminActivity(adminId, daysNumber);
  }

  @Get('archive')
  @ApiArchiveAuditLogs()
  async archiveLogs(@Request() req, @Query() query: CleanupQueryDto) {
    // Log this archiving action
    await this.auditService.logAdminAction(
      req.user.id,
      AuditAction.ARCHIVE_LOGS,
      'audit',
      req,
      { details: { retentionDays: query.retentionDays } },
    );

    const retention = query.retentionDays || 365;
    const archivedCount = await this.auditService.archiveOldLogs(retention, req.user.id);

    return {
      deletedCount: archivedCount, // Keep property name for compatibility
      message: `Successfully archived ${archivedCount} audit logs older than ${retention} days. Records preserved for compliance.`,
    };
  }

  @Get('logs/all')
  @ApiGetAllAuditLogs()
  async getAllAuditLogs(@Query() query: AuditLogQueryDto, @Request() req) {
    // Log this action
    await this.auditService.logAdminAction(
      req.user.id,
      AuditAction.VIEW_ARCHIVED_LOGS,
      'audit',
      req,
      { details: { includeArchived: true } },
    );

    const filters: AuditLogFilters & { includeArchived: boolean } = {
      adminId: query.adminId,
      action: query.action,
      resource: query.resource,
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page || 1,
      limit: query.limit || 50,
      includeArchived: true,
    };

    return this.auditService.getAllAuditLogs(filters);
  }

  @Get('cleanup')
  @ApiCleanupAuditLogs()
  async cleanupLogs(@Request() req, @Query() query: CleanupQueryDto) {
    // Log the forbidden attempt
    await this.auditService.logAdminAction(
      req.user.id,
      AuditAction.ATTEMPT_DELETE_LOGS,
      'audit',
      req,
      { 
        details: { 
          retentionDays: query.retentionDays,
          attemptedAction: 'DELETE_AUDIT_LOGS'
        },
        status: AuditStatus.FORBIDDEN,
        errorMessage: 'Attempted to delete audit logs - operation forbidden'
      },
    );

    throw new Error('FORBIDDEN: Audit logs cannot be deleted. Use /audit/archive for compliance-safe archiving.');
  }
}
