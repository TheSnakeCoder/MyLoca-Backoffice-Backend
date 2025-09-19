import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MylocaApiService } from '../myloca-api/myloca-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { GetJwtToken } from '../auth/decorators/get-jwt-token.decorator';
import { PaginationQueryDto } from './dto/common.dto';
import { UserSearchQueryDto } from './dto/users.dto';
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
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all users - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    return this.externalApiService.getAllUsers(pagination.page, pagination.limit, jwtToken);
  }

  @Get('profiles')
  @ApiGetAllUserProfiles()
  async getAllUserProfiles(
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all user profiles - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllUserProfiles(jwtToken, pagination.page, pagination.limit);
  }


  @Get('search')
  @ApiSearchUsers()
  async searchUsers(
    @Query() searchQuery: UserSearchQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} searching users with query: ${searchQuery.q} - Page: ${searchQuery.page || 1}, Limit: ${searchQuery.limit || 20}`);
    return this.externalApiService.searchUsers(searchQuery.q, searchQuery.page, searchQuery.limit, jwtToken);
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
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing friends of user: ${userId} - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    // This method doesn't exist in the updated service - use getAllUserFriends instead
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllUserFriends(jwtToken, pagination.page, pagination.limit);
  }

  @Get(':userId/friend-requests')
  @ApiGetUserFriendRequests()
  async getUserFriendRequests(
    @Param('userId') userId: string,
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing friend requests for user: ${userId} - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    // This method doesn't exist in the updated service - use getAllFriendRequests instead
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllFriendRequests(jwtToken, pagination.page, pagination.limit);
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
