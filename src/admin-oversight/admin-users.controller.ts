import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MylocaApiService } from '../myloca-api/myloca-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { GetJwtToken } from '../auth/decorators/get-jwt-token.decorator';
import {
  ApiUsersController,
  ApiGetAllUsers,
  ApiGetAllUserProfiles,
  ApiSearchUsers,
  ApiGetUserDetails,
  ApiGetUserFriends,
  ApiGetUserFriendRequests,
  ApiDeactivateUser,
  ApiReactivateUser,
} from './swagger/users.swagger';

@Controller('admin-oversight/users')
@UseGuards(JwtAuthGuard)
@ApiUsersController()
export class AdminUsersController { 
  constructor(
    private readonly externalApiService: MylocaApiService,
  ) {}

  @Get()
  @ApiGetAllUsers()
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all users`);
    return this.externalApiService.getAllUsers(page, limit, jwtToken);
  }

  @Get('profiles')
  @ApiGetAllUserProfiles()
  async getAllUserProfiles(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all user profiles`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllUserProfiles(jwtToken, page, limit);
  }


  @Get('search')
  @ApiSearchUsers()
  async searchUsers(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} searching users with query: ${query}`);
    return this.externalApiService.searchUsers(query, page, limit, jwtToken);
  }

  @Get(':userId')
  @ApiGetUserDetails()
  async getUserDetails(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing user details: ${userId}`);
    return this.externalApiService.getUserById(userId, jwtToken);
  }

  @Get(':userId/friends')
  @ApiGetUserFriends()
  async getUserFriends(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing friends of user: ${userId}`);
    // This method doesn't exist in the updated service - use getAllUserFriends instead
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllUserFriends(jwtToken, page, limit);
  }

  @Get(':userId/friend-requests')
  @ApiGetUserFriendRequests()
  async getUserFriendRequests(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing friend requests for user: ${userId}`);
    // This method doesn't exist in the updated service - use getAllFriendRequests instead
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllFriendRequests(jwtToken, page, limit);
  }

  @Post(':userId/deactivate')
  @ApiDeactivateUser()
  async deactivateUser(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} deactivating user: ${userId}`);
    return this.externalApiService.deactivateUser(userId, jwtToken);
  }

  @Post(':userId/reactivate')
  @ApiReactivateUser()
  async reactivateUser(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} reactivating user: ${userId}`);
    return this.externalApiService.reactivateUser(userId, jwtToken);
  }

}
