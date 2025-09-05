import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExternalApiService } from '../external-api/external-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('admin-oversight/locations')
@UseGuards(JwtAuthGuard)
export class AdminLocationsController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  @Get('active-users')
  async getAllActiveLocations(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} viewing all active user locations`);
    return this.externalApiService.getAllActiveLocations();
  }

  @Get('user/:userId')
  async getUserLocation(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing location for user: ${userId}`);
    return this.externalApiService.getUserLocation(userId);
  }

  @Get('user/:userId/history')
  async getUserLocationHistory(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing location history for user: ${userId}`);
    return this.externalApiService.getUserLocationHistory(userId, startDate, endDate, page, limit);
  }

  @Get('user/:userId/favorites')
  async getUserFavoriteLocations(
    @Param('userId') userId: string,
    @GetCurrentUser('username') adminUsername?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing favorite locations for user: ${userId}`);
    return this.externalApiService.getUserFavoriteLocations(userId);
  }

  @Get('stats')
  async getLocationStats(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} viewing location statistics`);
    return this.externalApiService.getLocationStats();
  }
}
