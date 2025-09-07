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
  FriendRequestsResponseDto,
  PendingFriendRequestsResponseDto,
  UserFriendsResponseDto,
  BlockedUsersResponseDto,
} from '../dto/friends.dto';

export const ApiFriendsController = () =>
  applyDecorators(
    ApiTags('Admin Friends'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Authentication required',
    }),
    ApiForbiddenResponse({
      description: 'Admin access required',
    }),
  );

export const ApiGetAllFriendRequests = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all friend requests',
      description: 'Retrieve all friend requests across the platform with pagination',
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
      description: 'All friend requests retrieved successfully',
      type: FriendRequestsResponseDto,
    }),
  );

export const ApiGetAllPendingFriendRequests = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all pending friend requests',
      description: 'Retrieve all pending friend requests across the platform with pagination',
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
      description: 'All pending friend requests retrieved successfully',
      type: PendingFriendRequestsResponseDto,
    }),
  );

export const ApiGetAllUserFriends = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all user friends',
      description: 'Retrieve all accepted friendships across the platform with pagination',
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
      description: 'All user friendships retrieved successfully',
      type: UserFriendsResponseDto,
    }),
  );

export const ApiGetAllBlockedUsers = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all blocked users',
      description: 'Retrieve all block relationships across the platform with pagination',
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
      description: 'All blocked users retrieved successfully',
      type: BlockedUsersResponseDto,
    }),
  );
