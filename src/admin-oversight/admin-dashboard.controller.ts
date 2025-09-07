import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MylocaApiService } from '../myloca-api/myloca-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { GetJwtToken } from '../auth/decorators/get-jwt-token.decorator';
import {
  ApiDashboardController,
  ApiGetDashboardStats,
  ApiGetDashboardActivity,
  ApiGetUserAnalytics,
  ApiGetLocationAnalytics,
  ApiGetSystemHealth,
} from './swagger/dashboard.swagger';

@Controller('admin-oversight/dashboard')
@UseGuards(JwtAuthGuard)
@ApiDashboardController()
export class AdminDashboardController {
  constructor(
    private readonly externalApiService: MylocaApiService,
  ) {}

  @Get('stats')
  @ApiGetDashboardStats()
  async getDashboardStats(
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing dashboard statistics`);
    
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    
    return this.externalApiService.getDashboardStats(jwtToken);
  }

  @Get('activity')
  @ApiGetDashboardActivity()
  async getDashboardActivity(
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing recent activity`);
    
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    
    return this.externalApiService.getDashboardActivity(jwtToken, limit);
  }

  @Get('analytics/users')
  @ApiGetUserAnalytics()
  async getUserAnalytics(
    @Query('days') days?: number,
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing user analytics`);
    
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    
    return this.externalApiService.getDashboardUserAnalytics(jwtToken, days);
  }

  @Get('analytics/locations')
  @ApiGetLocationAnalytics()
  async getLocationAnalytics(
    @GetCurrentUser('username') adminUsername?: string,
    @GetJwtToken() jwtToken?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing location analytics`);
    
    if (!jwtToken) {
      throw new Error('JWT token is required for admin operations');
    }
    
    return this.externalApiService.getDashboardLocationAnalytics(jwtToken);
  }

  @Get('health')
  @ApiGetSystemHealth()
  async getSystemHealth(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} checking system health`);
    
    const healthCheck = {
      timestamp: new Date().toISOString(),
      services: {
        externalApi: false,
        database: true, // Our local DB
        backoffice: true,
      },
      uptime: process.uptime(),
    };

    try {
      // Test connection to external API with health check endpoint
      const jwtToken = 'admin-health-check-token'; // This would need proper admin token
      await this.externalApiService.getHealthCheck(jwtToken);
      healthCheck.services.externalApi = true;
    } catch (error) {
      console.error('External API health check failed:', error.message);
    }

    return healthCheck;
  }
}
