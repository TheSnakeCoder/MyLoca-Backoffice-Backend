import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExternalApiService } from '../external-api/external-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('admin-oversight/dashboard')
@UseGuards(JwtAuthGuard)
export class AdminDashboardController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  @Get('stats')
  async getDashboardStats(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} viewing dashboard statistics`);
    
    try {
      const [systemStats, userStats, locationStats] = await Promise.all([
        this.externalApiService.getSystemStats(),
        this.externalApiService.getUserStats(),
        this.externalApiService.getLocationStats(),
      ]);

      return {
        system: systemStats,
        users: userStats,
        locations: locationStats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Return partial data if some services fail
      const stats: any = {
        timestamp: new Date().toISOString(),
        errors: [],
      };

      try {
        stats.system = await this.externalApiService.getSystemStats();
      } catch (e) {
        stats.errors.push('Failed to fetch system stats');
      }

      try {
        stats.users = await this.externalApiService.getUserStats();
      } catch (e) {
        stats.errors.push('Failed to fetch user stats');
      }

      try {
        stats.locations = await this.externalApiService.getLocationStats();
      } catch (e) {
        stats.errors.push('Failed to fetch location stats');
      }

      return stats;
    }
  }

  @Get('health')
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
      // Test connection to external API
      await this.externalApiService.getSystemStats();
      healthCheck.services.externalApi = true;
    } catch (error) {
      console.error('External API health check failed:', error.message);
    }

    return healthCheck;
  }
}
