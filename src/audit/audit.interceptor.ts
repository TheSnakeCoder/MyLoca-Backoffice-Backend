import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditService } from './audit.service';
import { AuditAction, AuditStatus } from '../../generated/prisma';
import { Request } from 'express';

// Decorator to define audit metadata
export const AuditLog = (action: AuditAction, resource: string) => SetMetadata('auditLog', { action, resource });

// Decorator to skip audit logging  
export const SkipAudit = () => SetMetadata('skipAudit', true);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    // Skip if no user (not authenticated)
    if (!user || !user.id) {
      return next.handle();
    }

    // Check if audit logging should be skipped
    const skipAudit = this.reflector.getAllAndOverride<boolean>('skipAudit', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAudit) {
      return next.handle();
    }

    // Get audit metadata from decorator
    const auditMetadata = this.reflector.getAllAndOverride<{
      action: AuditAction;
      resource: string;
    }>('auditLog', [context.getHandler(), context.getClass()]);

    // Determine action and resource automatically if not specified
    const { action, resource } = this.determineAuditInfo(
      request,
      auditMetadata,
      context,
    );

    const startTime = Date.now();

    return next.handle().pipe(
      tap((response) => {
        // Log successful action
        this.logAction(user.id, action, resource, request, {
          status: AuditStatus.SUCCESS,
          responseTime: Date.now() - startTime,
          response: this.sanitizeResponse(response),
        });
      }),
      catchError((error) => {
        // Log failed action
        this.logAction(user.id, action, resource, request, {
          status: this.getErrorStatus(error),
          errorMessage: error.message,
          responseTime: Date.now() - startTime,
          error: {
            name: error.name,
            message: error.message,
            status: error.status || error.statusCode,
          },
        });

        // Re-throw the error
        throw error;
      }),
    );
  }

  private determineAuditInfo(
    request: Request,
    metadata: { action: AuditAction; resource: string } | undefined,
    context: ExecutionContext,
  ): { action: AuditAction; resource: string } {
    if (metadata) {
      return metadata;
    }

    // Auto-determine from route and method
    const method = request.method;
    const url = request.url;
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    // Extract resource from URL or controller name
    let resource = 'unknown';
    if (url.includes('/admin')) resource = 'admin';
    else if (url.includes('/auth')) resource = 'auth';
    else if (url.includes('/audit')) resource = 'audit';
    else if (url.includes('/dashboard')) resource = 'dashboard';
    else if (url.includes('/user')) resource = 'user';
    else if (url.includes('/friend')) resource = 'friend';
    else if (url.includes('/location')) resource = 'location';

    // Determine action from method and handler name
    let action: AuditAction;
    
    if (method === 'GET') {
      if (handlerName.includes('findAll') || handlerName.includes('list') || url.includes('?')) {
        action = this.getListAction(resource);
      } else {
        action = this.getViewAction(resource);
      }
    } else if (method === 'POST') {
      if (handlerName.includes('login')) action = AuditAction.LOGIN;
      else if (handlerName.includes('logout')) action = AuditAction.LOGOUT;
      else if (handlerName.includes('refresh')) action = AuditAction.REFRESH_TOKEN;
      else action = this.getCreateAction(resource);
    } else if (method === 'PUT' || method === 'PATCH') {
      if (handlerName.includes('toggle') || handlerName.includes('activate') || handlerName.includes('deactivate')) {
        action = this.getToggleAction(resource);
      } else {
        action = this.getUpdateAction(resource);
      }
    } else if (method === 'DELETE') {
      action = this.getDeleteAction(resource);
    } else {
      action = AuditAction.READ;
    }

    return { action, resource };
  }

  private getViewAction(resource: string): AuditAction {
    switch (resource) {
      case 'admin': return AuditAction.VIEW_ADMIN;
      case 'user': return AuditAction.VIEW_USER;
      case 'friend': return AuditAction.VIEW_FRIENDSHIPS;
      case 'location': return AuditAction.VIEW_LOCATIONS;
      case 'dashboard': return AuditAction.VIEW_DASHBOARD;
      case 'audit': return AuditAction.VIEW_LOGS;
      default: return AuditAction.READ;
    }
  }

  private getListAction(resource: string): AuditAction {
    switch (resource) {
      case 'admin': return AuditAction.LIST_ADMINS;
      case 'user': return AuditAction.LIST_USERS;
      case 'friend': return AuditAction.LIST_FRIENDSHIPS;
      case 'location': return AuditAction.LIST_LOCATIONS;
      case 'dashboard': return AuditAction.VIEW_ANALYTICS;
      default: return AuditAction.READ;
    }
  }

  private getCreateAction(resource: string): AuditAction {
    switch (resource) {
      case 'admin': return AuditAction.CREATE_ADMIN;
      default: return AuditAction.CREATE;
    }
  }

  private getUpdateAction(resource: string): AuditAction {
    switch (resource) {
      case 'admin': return AuditAction.UPDATE_ADMIN;
      case 'user': return AuditAction.UPDATE_USER;
      default: return AuditAction.UPDATE;
    }
  }

  private getDeleteAction(resource: string): AuditAction {
    switch (resource) {
      case 'admin': return AuditAction.DELETE_ADMIN;
      case 'user': return AuditAction.DELETE_USER;
      case 'friend': return AuditAction.DELETE_FRIENDSHIP;
      case 'location': return AuditAction.DELETE_LOCATION;
      default: return AuditAction.DELETE;
    }
  }

  private getToggleAction(resource: string): AuditAction {
    switch (resource) {
      case 'admin': return AuditAction.ACTIVATE_ADMIN;
      case 'user': return AuditAction.ACTIVATE_USER;
      default: return AuditAction.UPDATE;
    }
  }

  private async logAction(
    adminId: string,
    action: AuditAction,
    resource: string,
    request: Request,
    options: {
      status?: AuditStatus;
      errorMessage?: string;
      responseTime?: number;
      response?: any;
      error?: any;
    } = {},
  ) {
    try {
      // Extract resource ID from URL params
      const resourceId = request.params?.id;

      await this.auditService.logAdminAction(
        adminId,
        action,
        resource,
        request,
        {
          resourceId,
          details: {
            responseTime: options.responseTime,
            response: options.response,
            error: options.error,
          },
          status: options.status,
          errorMessage: options.errorMessage,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log audit action:', error);
    }
  }

  private getErrorStatus(error: any): AuditStatus {
    const status = error.status || error.statusCode;
    
    if (status === 401) return AuditStatus.UNAUTHORIZED;
    if (status === 403) return AuditStatus.FORBIDDEN;
    if (status >= 400 && status < 500) return AuditStatus.FAILED;
    
    return AuditStatus.ERROR;
  }

  private sanitizeResponse(response: any): any {
    if (!response || typeof response !== 'object') {
      return response;
    }

    // Limit response size for logging
    const responseString = JSON.stringify(response);
    if (responseString.length > 5000) {
      return {
        _truncated: true,
        _size: responseString.length,
        _preview: responseString.substring(0, 500) + '...',
      };
    }

    return response;
  }
}
