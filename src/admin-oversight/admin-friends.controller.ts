import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MylocaApiService } from '../myloca-api/myloca-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { GetJwtToken } from '../auth/decorators/get-jwt-token.decorator';
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
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all friend requests`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllFriendRequests(jwtToken, page, limit);
  }

  @Get('requests/pending')
  @ApiGetAllPendingFriendRequests()
  async getAllPendingFriendRequests(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all pending friend requests`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllPendingFriendRequests(jwtToken, page, limit);
  }

  @Get()
  @ApiGetAllUserFriends()
  async getAllUserFriends(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all user friends`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllUserFriends(jwtToken, page, limit);
  }

  @Get('blocked')
  @ApiGetAllBlockedUsers()
  async getAllBlockedUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all blocked users`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllBlockedUsers(jwtToken, page, limit);
  }
}
