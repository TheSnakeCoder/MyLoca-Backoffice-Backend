import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MylocaApiService } from '../myloca-api/myloca-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('admin-oversight/test')
@UseGuards(JwtAuthGuard)
export class AdminTestController {
  constructor(private readonly externalApiService: MylocaApiService) {}

  @Get('connection')
  async testConnection(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} testing external API connection`);
    
    try {
      // Test basic endpoint without admin privileges
      const users = await this.externalApiService.getAllUsers(1, 5);
      
      return {
        status: 'success',
        message: 'External API connection successful',
        data: users,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'External API connection failed',
        error: error.message,
        statusCode: error.status || 500,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('endpoints')
  async testEndpoints(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} testing multiple external API endpoints`);
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    };

    // Test various endpoints
    const endpointTests = [
      { name: 'Get Users', method: () => this.externalApiService.getAllUsers(1, 2) },
      { name: 'Search Users', method: () => this.externalApiService.searchUsers('test', 1, 2) },
      // Add more tests as needed
    ];

    for (const test of endpointTests) {
      try {
        const result = await test.method();
        results.tests.push({
          endpoint: test.name,
          status: 'success',
          hasData: !!result,
          dataLength: Array.isArray(result) ? result.length : 'N/A',
        });
      } catch (error: any) {
        results.tests.push({
          endpoint: test.name,
          status: 'error',
          error: error.message,
          statusCode: error.status || 500,
        });
      }
    }

    return results;
  }
}
