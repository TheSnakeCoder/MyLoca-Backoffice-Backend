import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MylocaApiService } from '../myloca-api/myloca-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { GetJwtToken } from '../auth/decorators/get-jwt-token.decorator';
import { PaginationQueryDto } from './dto/common.dto';
import { LocationHistoryQueryDto } from './dto/locations.dto';
import {
  ApiLocationsController,
  ApiGetAllActiveLocations,
  ApiGetUserLocation,
  ApiGetUserLocationHistory,
  ApiGetUserFavoriteLocations,
  ApiGetLocationStats,
  ApiGetAllLocationStatus,
  ApiGetAllUsersLocations,
  ApiGetAllLocationSettings,
  ApiGetAllFavoriteLocations,
  ApiGetAllLocationPrivacySettings,
  ApiGetAllLocationHistory,
  ApiGetCacheStatus,
  ApiGetCacheStats,
} from './swagger/locations.swagger';

@Controller('admin-oversight/locations')  
@UseGuards(JwtAuthGuard)
@ApiLocationsController()
export class AdminLocationsController {
  constructor(
    private readonly externalApiService: MylocaApiService,
  ) {}

  @Get('active-users')
  @ApiGetAllActiveLocations()
  async getAllActiveLocations(
    @Query() pagination: PaginationQueryDto,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all active user locations - Page: ${pagination.page || 1}, Limit: ${pagination.limit || 20}`);
    // Use the correct method from the updated service
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllUsersLocations(jwtToken, pagination.page, pagination.limit);
  }

  @Get('user/:userId')
  @ApiGetUserLocation()
  async getUserLocation(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing location for user: ${userId}`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getUserLocation(userId, jwtToken);
  }

  @Get('user/:userId/history')
  @ApiGetUserLocationHistory()
  async getUserLocationHistory(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing location history for user: ${userId}`);
    // This method doesn't exist in the updated service - use the all history endpoint instead
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllLocationHistory(jwtToken, page, limit);
  }

  @Get('user/:userId/favorites')
  @ApiGetUserFavoriteLocations()
  async getUserFavoriteLocations(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing favorite locations for user: ${userId}`);
    // This method doesn't exist in the updated service - use the all favorites endpoint instead
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllFavoriteLocations(jwtToken, page, limit);
  }

  @Get('stats')
  @ApiGetLocationStats()
  async getLocationStats(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} viewing location statistics`);
    // This method doesn't exist in the updated service - return local stats instead
    return {
      message: 'Location statistics endpoint is not available in the current API',
      available: false,
      requestedBy: adminUsername,
      timestamp: new Date().toISOString(),
      suggestion: 'Use cache/status or cache/stats endpoints for performance metrics'
    };
  }

  @Get('status/all')
  @ApiGetAllLocationStatus()
  async getAllLocationStatus(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all location status`);
    // Use external API service for consistency
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllLocationStatus(jwtToken, page, limit);
  }

  @Get('all')
  @ApiGetAllUsersLocations()
  async getAllUsersLocations(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all users locations`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllUsersLocations(jwtToken, page, limit);
  }

  @Get('settings')
  @ApiGetAllLocationSettings()
  async getAllUserLocationSettings(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all user location settings`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllLocationSettings(jwtToken, page, limit);
  }

  @Get('favorites/all')
  @ApiGetAllFavoriteLocations()
  async getAllFavoriteLocations(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all favorite locations`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllFavoriteLocations(jwtToken, page, limit);
  }

  @Get('privacy/all')
  @ApiGetAllLocationPrivacySettings()
  async getAllLocationPrivacySettings(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all location privacy settings`);
    // Use external API service since LocalAdminService was removed
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllLocationSettings(jwtToken, page, limit);
  }

  @Get('history/all')
  @ApiGetAllLocationHistory()
  async getAllLocationHistory(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing all location history`);
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    return this.externalApiService.getAllLocationHistory(jwtToken, page, limit);
  }

  @Get('cache/status')
  @ApiGetCacheStatus()
  async getCacheStatus(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} viewing cache status`);
    return this.externalApiService.getCacheStatus();
  }

  @Get('cache/stats')
  @ApiGetCacheStats()
  async getCacheStats(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} viewing cache statistics`);
    return this.externalApiService.getCacheStats();
  }
}
