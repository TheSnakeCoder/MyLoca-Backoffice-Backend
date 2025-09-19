import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction, AuditStatus, AdminAuditLog } from '../../generated/prisma';
import { Request } from 'express';

export interface CreateAuditLogDto {
  adminId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  method: string;
  endpoint: string;
  details?: any;
  metadata?: any;
  status?: AuditStatus;
  errorMessage?: string;
}

export interface AuditLogFilters {
  adminId?: string;
  action?: AuditAction;
  resource?: string;
  status?: AuditStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new audit log entry
   */
  async createAuditLog(data: CreateAuditLogDto): Promise<AdminAuditLog | null> {
    try {
      const auditLog = await this.prisma.adminAuditLog.create({
        data: {
          adminId: data.adminId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          method: data.method,
          endpoint: data.endpoint,
          details: data.details,
          metadata: data.metadata,
          status: data.status || AuditStatus.SUCCESS,
          errorMessage: data.errorMessage,
        },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      this.logger.log(
        `Audit log created: ${data.action} on ${data.resource} by admin ${data.adminId}`,
      );

      return auditLog;
    } catch (error) {
      this.logger.error('Failed to create audit log:', error);
      // Don't throw error to avoid breaking the main operation
      return null;
    }
  }

  /**
   * Log admin action from HTTP request
   */
  async logAdminAction(
    adminId: string,
    action: AuditAction,
    resource: string,
    request: Request,
    options: {
      resourceId?: string;
      details?: any;
      status?: AuditStatus;
      errorMessage?: string;
    } = {},
  ): Promise<AdminAuditLog | null> {
    const metadata = {
      ip: request.ip || request.connection?.remoteAddress,
      userAgent: request.get('User-Agent'),
      timestamp: new Date().toISOString(),
      query: request.query,
      params: request.params,
    };

    // Filter sensitive data from request body
    const filteredBody = this.filterSensitiveData(request.body);

    return this.createAuditLog({
      adminId,
      action,
      resource,
      resourceId: options.resourceId,
      method: request.method,
      endpoint: request.route?.path || request.url,
      details: {
        body: filteredBody,
        ...options.details,
      },
      metadata,
      status: options.status,
      errorMessage: options.errorMessage,
    });
  }

  /**
   * Get audit logs with filtering and pagination (excludes archived by default)
   */
  async getAuditLogs(filters: AuditLogFilters = {}) {
    // Default to excluding archived logs for normal operations
    return this.getAllAuditLogs({ ...filters, includeArchived: false });
  }

  /**
   * Get audit log statistics
   */
  async getAuditStats(adminId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      timestamp: {
        gte: startDate,
      },
    };

    if (adminId) where.adminId = adminId;

    const [
      totalActions,
      actionsByType,
      actionsByStatus,
      actionsByResource,
      recentActivity,
    ] = await Promise.all([
      // Total actions
      this.prisma.adminAuditLog.count({ where }),

      // Actions by type
      this.prisma.adminAuditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
        orderBy: {
          _count: {
            action: 'desc',
          },
        },
      }),

      // Actions by status
      this.prisma.adminAuditLog.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),

      // Actions by resource
      this.prisma.adminAuditLog.groupBy({
        by: ['resource'],
        where,
        _count: true,
        orderBy: {
          _count: {
            resource: 'desc',
          },
        },
      }),

      // Recent activity (last 24 hours)
      this.prisma.adminAuditLog.findMany({
        where: {
          ...where,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 10,
      }),
    ]);

    return {
      totalActions,
      actionsByType: actionsByType.map((item) => ({
        action: item.action,
        count: item._count,
      })),
      actionsByStatus: actionsByStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      actionsByResource: actionsByResource.map((item) => ({
        resource: item.resource,
        count: item._count,
      })),
      recentActivity,
      period: `Last ${days} days`,
    };
  }

  /**
   * Get admin activity summary
   */
  async getAdminActivity(adminId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.prisma.adminAuditLog.findMany({
      where: {
        adminId,
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 100,
    });

    const summary = {
      totalActions: logs.length,
      actionsByType: this.groupBy(logs, 'action'),
      actionsByResource: this.groupBy(logs, 'resource'),
      actionsByStatus: this.groupBy(logs, 'status'),
      recentActions: logs.slice(0, 10),
      period: `Last ${days} days`,
    };

    return summary;
  }

  /**
   * Archive old audit logs (NEVER DELETE - only archive for compliance)
   * This method marks old logs as archived instead of deleting them
   */
  async archiveOldLogs(
    retentionDays: number = 365,
    archivedBy: string,
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Only archive non-archived logs
    const result = await this.prisma.adminAuditLog.updateMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
        isArchived: false, // Only archive non-archived logs
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: archivedBy,
      },
    });

    this.logger.log(
      `Archived ${result.count} audit logs older than ${retentionDays} days by admin ${archivedBy}`,
    );

    // Log this archiving action itself
    await this.createAuditLog({
      adminId: archivedBy,
      action: AuditAction.ARCHIVE_LOGS,
      resource: 'audit',
      method: 'PATCH',
      endpoint: '/audit/archive',
      details: {
        retentionDays,
        archivedCount: result.count,
        cutoffDate: cutoffDate.toISOString(),
      },
      status: AuditStatus.SUCCESS,
    });

    return result.count;
  }

  /**
   * DEPRECATED: This method is disabled for security and compliance
   * Audit logs should NEVER be deleted, only archived
   */
  async cleanupOldLogs(retentionDays: number = 365): Promise<never> {
    this.logger.error(
      'SECURITY VIOLATION: Attempt to delete audit logs detected. This operation is forbidden.',
    );
    
    throw new Error(
      'FORBIDDEN: Audit logs cannot be deleted. Use archiveOldLogs() instead for compliance.',
    );
  }

  /**
   * Get audit logs including archived ones (admin only)
   */
  async getAllAuditLogs(
    filters: AuditLogFilters & { includeArchived?: boolean } = {},
  ) {
    const {
      adminId,
      action,
      resource,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      includeArchived = false,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (adminId) where.adminId = adminId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (status) where.status = status;

    // Only include archived logs if explicitly requested
    if (!includeArchived) {
      where.isArchived = false;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [logs, total, archivedCount] = await Promise.all([
      this.prisma.adminAuditLog.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.adminAuditLog.count({ where }),
      this.prisma.adminAuditLog.count({
        where: { ...where, isArchived: true },
      }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      metadata: {
        includeArchived,
        archivedCount,
        activeCount: total - (includeArchived ? 0 : archivedCount),
      },
    };
  }

  /**
   * Helper method to filter sensitive data from request body
   */
  private filterSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = [
      'password',
      'token',
      'refreshToken',
      'secret',
      'key',
      'apiKey',
    ];

    const filtered = { ...data };

    for (const field of sensitiveFields) {
      if (filtered[field]) {
        filtered[field] = '[FILTERED]';
      }
    }

    return filtered;
  }

  /**
   * Helper method to group array items by a property
   */
  private groupBy(array: any[], property: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = item[property];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }
}
