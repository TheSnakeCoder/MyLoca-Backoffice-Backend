import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  DashboardStatsResponseDto,
  DashboardActivityResponseDto,
  UserAnalyticsResponseDto,
  LocationAnalyticsResponseDto,
  DashboardActivityQueryDto,
  UserAnalyticsQueryDto,
} from '../dto/dashboard.dto';

export const ApiDashboardController = () =>
  applyDecorators(
    ApiTags('Admin Dashboard'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Authentication required',
    }),
    ApiForbiddenResponse({
      description: 'Admin access required',
    }),
  );

export const ApiGetDashboardStats = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get dashboard statistics',
      description: 'Retrieve comprehensive platform analytics including users, friendships, locations, and system metrics',
    }),
    ApiResponse({
      status: 200,
      description: 'Dashboard statistics retrieved successfully',
      type: DashboardStatsResponseDto,
    }),
  );

export const ApiGetDashboardActivity = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get recent activity',
      description: 'Retrieve recent user registrations, friendships, and location updates across the platform',
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per category to return (max: 50, default: 10)',
      required: false,
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Recent activity retrieved successfully',
      type: DashboardActivityResponseDto,
    }),
  );

export const ApiGetUserAnalytics = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user analytics',
      description: 'Retrieve user growth trends and registration analytics over specified time period',
    }),
    ApiQuery({
      name: 'days',
      type: Number,
      description: 'Analysis period in days (max: 365, default: 30)',
      required: false,
      example: 30,
    }),
    ApiResponse({
      status: 200,
      description: 'User analytics retrieved successfully',
      type: UserAnalyticsResponseDto,
    }),
  );

export const ApiGetLocationAnalytics = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get location analytics',
      description: 'Retrieve location usage statistics including privacy settings, favorite categories, and live location patterns',
    }),
    ApiResponse({
      status: 200,
      description: 'Location analytics retrieved successfully',
      type: LocationAnalyticsResponseDto,
    }),
  );

export const ApiGetSystemHealth = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get system health status',
      description: 'Check the health of external API connections and system services',
    }),
    ApiResponse({
      status: 200,
      description: 'System health status retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            example: '2024-01-15T10:30:00.000Z',
            description: 'Health check timestamp',
          },
          services: {
            type: 'object',
            properties: {
              externalApi: {
                type: 'boolean',
                example: true,
                description: 'External API service status',
              },
              database: {
                type: 'boolean',
                example: true,
                description: 'Database service status',
              },
              backoffice: {
                type: 'boolean',
                example: true,
                description: 'Backoffice service status',
              },
            },
          },
          uptime: {
            type: 'number',
            example: 86400,
            description: 'System uptime in seconds',
          },
        },
      },
    }),
  );
