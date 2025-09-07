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
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  UserResponseDto,
  UserProfileResponseDto,
  UserDetailsResponseDto,
  UserActionResponseDto,
  UserSearchQueryDto,
} from '../dto/users.dto';
import { PaginationQueryDto } from '../dto/common.dto';

export const ApiUsersController = () =>
  applyDecorators(
    ApiTags('Admin Users'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Authentication required',
    }),
    ApiForbiddenResponse({
      description: 'Admin access required',
    }),
  );

export const ApiGetAllUsers = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all users',
      description: 'Retrieve list of all users with pagination support',
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
      description: 'Users retrieved successfully',
      type: UserResponseDto,
    }),
  );

export const ApiGetAllUserProfiles = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all user profiles',
      description: 'Retrieve comprehensive user profiles with associated data including locations, favorites, and statistics',
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
      description: 'User profiles retrieved successfully',
      type: UserProfileResponseDto,
    }),
  );

export const ApiSearchUsers = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Search users',
      description: 'Search for users by username with pagination support',
    }),
    ApiQuery({
      name: 'q',
      type: String,
      description: 'Search query for username',
      required: true,
      example: 'john',
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
      description: 'Search results retrieved successfully',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid search parameters',
    }),
  );

export const ApiGetUserDetails = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user by ID',
      description: 'Retrieve specific user profile information',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'User ID',
      example: 'user_123456789',
    }),
    ApiResponse({
      status: 200,
      description: 'User details retrieved successfully',
      type: UserDetailsResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
  );

export const ApiGetUserFriends = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user friends',
      description: 'Retrieve all accepted friendships across the platform (admin view)',
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
      description: 'User friends retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              description: 'Friendship objects with user details',
            },
          },
          pagination: {
            type: 'object',
            description: 'Pagination information',
          },
        },
      },
    }),
  );

export const ApiGetUserFriendRequests = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user friend requests',
      description: 'Retrieve all friend requests across the platform (admin view)',
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
      description: 'Friend requests retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              description: 'Friend request objects with user details',
            },
          },
          pagination: {
            type: 'object',
            description: 'Pagination information',
          },
        },
      },
    }),
  );

export const ApiDeactivateUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deactivate user account',
      description: 'Safely deactivate a user account (admin operation)',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'User ID to deactivate',
      example: 'user_123456789',
    }),
    ApiResponse({
      status: 200,
      description: 'User deactivated successfully',
      type: UserActionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
    ApiBadRequestResponse({
      description: 'User already deactivated',
    }),
  );

export const ApiReactivateUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reactivate user account',
      description: 'Reactivate a previously deactivated user account (admin operation)',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'User ID to reactivate',
      example: 'user_123456789',
    }),
    ApiResponse({
      status: 200,
      description: 'User reactivated successfully',
      type: UserActionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
    ApiBadRequestResponse({
      description: 'User already active',
    }),
  );
