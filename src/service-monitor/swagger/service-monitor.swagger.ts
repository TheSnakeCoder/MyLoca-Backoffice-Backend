import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  SystemHealthDto,
  ServiceHealthDto,
  ServiceMetricsDto,
} from '../dto/service-status.dto';

export const ApiServiceMonitorController = () =>
  applyDecorators(
    ApiTags('Service Monitor'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Authentication required',
    }),
    ApiForbiddenResponse({
      description: 'Admin access required',
    }),
  );

export const ApiGetSystemHealth = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get overall system health',
      description: 'Returns comprehensive health status of all monitored services including database, external API, and internal services',
    }),
    ApiResponse({
      status: 200,
      description: 'System health retrieved successfully',
      type: SystemHealthDto,
    }),
    ApiResponse({
      status: 503,
      description: 'Service Unavailable - One or more critical services are down',
    }),
    ApiInternalServerErrorResponse({
      description: 'Health check failed',
    }),
  );

export const ApiGetServiceHealth = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get specific service health',
      description: 'Returns detailed health status of a specific monitored service',
    }),
    ApiParam({
      name: 'serviceName',
      description: 'Name of the service to check',
      example: 'PostgreSQL Database',
    }),
    ApiResponse({
      status: 200,
      description: 'Service health retrieved successfully',
      type: ServiceHealthDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Service not found',
    }),
    ApiInternalServerErrorResponse({
      description: 'Health check failed',
    }),
  );

export const ApiTriggerHealthCheck = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Trigger manual health check',
      description: 'Manually triggers a comprehensive health check for all monitored services',
    }),
    ApiResponse({
      status: 200,
      description: 'Health check completed successfully',
      type: SystemHealthDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Health check failed',
    }),
  );

export const ApiGetServiceMetrics = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get service performance metrics',
      description: 'Returns performance metrics including response times, success rates, and error counts for all or specific services',
    }),
    ApiQuery({
      name: 'serviceName',
      required: false,
      description: 'Filter metrics by specific service name',
      example: 'PostgreSQL Database',
    }),
    ApiResponse({
      status: 200,
      description: 'Service metrics retrieved successfully',
      type: [ServiceMetricsDto],
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve metrics',
    }),
  );

export const ApiGetServiceHistory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get service health history',
      description: 'Returns historical health data for a specific service with configurable limit',
    }),
    ApiParam({
      name: 'serviceName',
      description: 'Name of the service',
      example: 'PostgreSQL Database',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of history entries to return',
      example: 50,
    }),
    ApiResponse({
      status: 200,
      description: 'Service history retrieved successfully',
      type: [ServiceHealthDto],
    }),
    ApiResponse({
      status: 404,
      description: 'Service not found',
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve history',
    }),
  );

export const ApiGetRegisteredServices = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get registered services',
      description: 'Returns list of all services currently being monitored by the system',
    }),
    ApiResponse({
      status: 200,
      description: 'Registered services retrieved successfully',
      schema: {
        type: 'array',
        items: { type: 'string' },
        example: ['PostgreSQL Database', 'MyLoca External API', 'Internal Services'],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve services',
    }),
  );

export const ApiGetAvailableActions = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get available auto actions',
      description: 'Returns list of available automated actions that can be triggered when services have issues',
    }),
    ApiResponse({
      status: 200,
      description: 'Available actions retrieved successfully',
      schema: {
        type: 'array',
        items: { type: 'string' },
        example: ['Sends alerts through multiple notification channels when services have issues (manual intervention required)'],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve actions',
    }),
  );

export const ApiGetMonitoringConfig = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get monitoring configuration',
      description: 'Returns current monitoring system configuration including intervals, thresholds, and enabled features',
    }),
    ApiResponse({
      status: 200,
      description: 'Monitoring configuration retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean', example: true },
          checkInterval: { type: 'number', example: 60 },
          retryAttempts: { type: 'number', example: 3 },
          timeout: { type: 'number', example: 30000 },
          alerting: {
            type: 'object',
            properties: {
              enabled: { type: 'boolean', example: true },
              responseTimeThreshold: { type: 'number', example: 5000 },
              errorRateThreshold: { type: 'number', example: 10 },
              uptimeThreshold: { type: 'number', example: 95 },
            },
          },
          autoActions: {
            type: 'object',
            properties: {
              enabled: { type: 'boolean', example: true },
              actions: { type: 'array', items: { type: 'string' }, example: ['alert'] },
            },
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve configuration',
    }),
  );

export const ApiUpdateMonitoringConfig = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update monitoring configuration',
      description: 'Updates monitoring system configuration settings',
    }),
    ApiResponse({
      status: 200,
      description: 'Monitoring configuration updated successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid configuration data',
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to update configuration',
    }),
  );

export const ApiGetDashboardData = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get monitoring dashboard data',
      description: 'Returns comprehensive dashboard data including health status, metrics, configuration, and available services',
    }),
    ApiResponse({
      status: 200,
      description: 'Dashboard data retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          systemHealth: { $ref: '#/components/schemas/SystemHealthDto' },
          metrics: { type: 'array', items: { $ref: '#/components/schemas/ServiceMetricsDto' } },
          config: { type: 'object' },
          services: { type: 'array', items: { type: 'string' } },
          actions: { type: 'array', items: { type: 'string' } },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve dashboard data',
    }),
  );

export const ApiGetStatusSummary = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get quick status summary',
      description: 'Returns a quick overview of system status for dashboard widgets and status displays',
    }),
    ApiResponse({
      status: 200,
      description: 'Status summary retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          overallStatus: { type: 'string', example: 'HEALTHY' },
          totalServices: { type: 'number', example: 3 },
          healthyServices: { type: 'number', example: 3 },
          issues: { type: 'number', example: 0 },
          uptime: { type: 'number', example: 86400 },
          lastCheck: { type: 'string', format: 'date-time', example: '2024-01-20T10:30:00Z' },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve status summary',
    }),
  );

export const ApiGetHealthTrends = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get health trends',
      description: 'Returns health trends for dashboard charts and analytics over a specified time period',
    }),
    ApiQuery({
      name: 'hours',
      required: false,
      type: Number,
      description: 'Number of hours to include in trends analysis',
      example: 24,
    }),
    ApiResponse({
      status: 200,
      description: 'Health trends retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            serviceName: { type: 'string', example: 'PostgreSQL Database' },
            trend: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  timestamp: { type: 'string', format: 'date-time' },
                  status: { type: 'string', example: 'HEALTHY' },
                  responseTime: { type: 'number', example: 45 },
                },
              },
            },
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve health trends',
    }),
  );

