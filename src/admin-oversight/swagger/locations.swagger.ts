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
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  LocationStatusResponseDto,
  LocationsResponseDto,
  LocationSettingsResponseDto,
  FavoriteLocationsResponseDto,
  LocationHistoryResponseDto,
  LocationDetailsResponseDto,
  CacheStatusDto,
} from '../dto/locations.dto';

export const ApiLocationsController = () =>
  applyDecorators(
    ApiTags('Admin Locations'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Authentication required',
    }),
    ApiForbiddenResponse({
      description: 'Admin access required',
    }),
  );

export const ApiGetAllActiveLocations = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all user locations',
      description: 'Retrieve all user locations across the platform with decrypted coordinates and pagination',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'All user locations retrieved successfully',
      type: LocationsResponseDto,
    }),
  );

export const ApiGetUserLocation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user location',
      description: 'Retrieve specific user location with decrypted coordinates',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'User ID',
      example: 'user_123456789',
    }),
    ApiResponse({
      status: 200,
      description: 'User location retrieved successfully',
      type: LocationDetailsResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'User location not found',
    }),
  );

export const ApiGetUserLocationHistory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get location history',
      description: 'Retrieve all location history across users with decrypted coordinates and pagination',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'User ID',
      example: 'user_123456789',
    }),
    ApiQuery({
      name: 'startDate',
      type: String,
      description: 'Start date for filtering (ISO format)',
      required: false,
      example: '2024-01-01T00:00:00.000Z',
    }),
    ApiQuery({
      name: 'endDate',
      type: String,
      description: 'End date for filtering (ISO format)',
      required: false,
      example: '2024-01-31T23:59:59.999Z',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'Location history retrieved successfully',
      type: LocationHistoryResponseDto,
    }),
  );

export const ApiGetUserFavoriteLocations = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get favorite locations',
      description: 'Retrieve all favorite locations across users with decrypted coordinates and pagination',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'User ID',
      example: 'user_123456789',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'Favorite locations retrieved successfully',
      type: FavoriteLocationsResponseDto,
    }),
  );

export const ApiGetLocationStats = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get location statistics (Not Available)',
      description: 'Location statistics endpoint is not available in the current API. Use cache endpoints for performance metrics.',
    }),
    ApiResponse({
      status: 200,
      description: 'Information about endpoint availability',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Location statistics endpoint is not available in the current API',
          },
          available: {
            type: 'boolean',
            example: false,
          },
          suggestion: {
            type: 'string',
            example: 'Use cache/status or cache/stats endpoints for performance metrics',
          },
        },
      },
    }),
  );

export const ApiGetAllLocationStatus = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all location status',
      description: 'Retrieve all user location statuses across the platform with pagination',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'All location statuses retrieved successfully',
      type: LocationStatusResponseDto,
    }),
  );

export const ApiGetAllUsersLocations = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all users locations',
      description: 'Retrieve all user locations across the platform with decrypted coordinates and pagination',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'All user locations retrieved successfully',
      type: LocationsResponseDto,
    }),
  );

export const ApiGetAllLocationSettings = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all location settings',
      description: 'Retrieve all user location privacy and sharing settings',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'All location settings retrieved successfully',
      type: LocationSettingsResponseDto,
    }),
  );

export const ApiGetAllFavoriteLocations = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all favorite locations',
      description: 'Retrieve all favorite locations across users with decrypted coordinates and pagination',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'All favorite locations retrieved successfully',
      type: FavoriteLocationsResponseDto,
    }),
  );

export const ApiGetAllLocationPrivacySettings = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all location privacy settings',
      description: 'Retrieve all user location privacy and sharing settings with privacy statistics',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'All location privacy settings retrieved successfully',
      type: LocationSettingsResponseDto,
    }),
  );

export const ApiGetAllLocationHistory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all location history',
      description: 'Retrieve all location history across users with decrypted coordinates and pagination',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page (max: 100)',
      required: false,
      example: 20,
    }),
    ApiQuery({
      name: 'startDate',
      type: String,
      description: 'Start date for filtering (ISO format)',
      required: false,
      example: '2024-01-01T00:00:00.000Z',
    }),
    ApiQuery({
      name: 'endDate',
      type: String,
      description: 'End date for filtering (ISO format)',
      required: false,
      example: '2024-01-31T23:59:59.999Z',
    }),
    ApiResponse({
      status: 200,
      description: 'All location history retrieved successfully',
      type: LocationHistoryResponseDto,
    }),
  );

export const ApiGetCacheStatus = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get cache status',
      description: 'Get comprehensive cache system status and health',
    }),
    ApiResponse({
      status: 200,
      description: 'Cache status retrieved successfully',
      type: CacheStatusDto,
    }),
  );

export const ApiGetCacheStats = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get cache statistics',
      description: 'Get cache performance metrics',
    }),
    ApiResponse({
      status: 200,
      description: 'Cache statistics retrieved successfully',
      schema: {
        type: 'object',
        description: 'Cache performance metrics object',
      },
    }),
  );
