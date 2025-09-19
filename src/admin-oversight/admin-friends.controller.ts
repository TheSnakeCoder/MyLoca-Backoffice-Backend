import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MylocaApiService } from '../myloca-api/myloca-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { GetJwtToken } from '../auth/decorators/get-jwt-token.decorator';
import { PaginationQueryDto } from './dto/common.dto';
import {
  ApiFriendsController,
  ApiGetAllFriendRequests,
  ApiGetAllPendingFriendRequests,
  ApiGetAllUserFriends,
  ApiGetAllBlockedUsers,
} from './swagger/friends.swagger';

@Controller('admin-oversight/friends')
@UseGuards(JwtAuthGuard)
@ApiFriendsController()
export class AdminFriendsController {
  constructor(private readonly externalApiService: MylocaApiService) {}

  @Get('requests')
  @ApiGetAllFriendRequests()
  async getAllFriendRequests(
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all friend requests - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllFriendRequests(jwtToken, pagination.page, pagination.limit);
  }

  @Get('requests/pending')
  @ApiGetAllPendingFriendRequests()
  async getAllPendingFriendRequests(
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all pending friend requests - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllPendingFriendRequests(jwtToken, pagination.page, pagination.limit);
  }

  @Get()
  @ApiGetAllUserFriends()
  async getAllUserFriends(
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all user friends - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllUserFriends(jwtToken, pagination.page, pagination.limit);
  }

  @Get('blocked')
  @ApiGetAllBlockedUsers()
  async getAllBlockedUsers(
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all blocked users - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllBlockedUsers(jwtToken, pagination.page, pagination.limit);
  }
}
