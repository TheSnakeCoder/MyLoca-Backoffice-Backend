import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExternalApiService } from '../external-api/external-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { GetJwtToken } from '../auth/decorators/get-jwt-token.decorator';

@Controller('admin-oversight/users')
@UseGuards(JwtAuthGuard)
export class AdminUsersController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  @Get()
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all users`);
    return this.externalApiService.getAllUsers(page, limit, jwtToken);
  }

  @Get('search')
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
  async getUserDetails(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing user details: ${userId}`);
    return this.externalApiService.getUserById(userId, jwtToken);
  }

  @Get(':userId/friends')
  async getUserFriends(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing friends of user: ${userId}`);
    return this.externalApiService.getUserFriends(userId, page, limit, jwtToken);
  }

  @Get(':userId/friend-requests')
  async getUserFriendRequests(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing friend requests for user: ${userId}`);
    return this.externalApiService.getUserFriendRequests(userId, jwtToken);
  }

  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateData: {
      email?: string;
      username?: string;
      isActive?: boolean;
    },
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} updating user: ${userId}`, updateData);
    return this.externalApiService.updateUser(userId, updateData, jwtToken);
  }

  @Delete(':userId')
  async deleteUser(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} deleting user: ${userId}`);
    return this.externalApiService.deleteUser(userId, jwtToken);
  }
}
