import { Injectable, Logger } from '@nestjs/common';
import { MylocaApiService } from '../../myloca-api/myloca-api.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IServiceChecker } from '../interfaces/service-checker.interface';
import { ServiceHealthDto, ServiceStatus, ServiceType } from '../dto/service-status.dto';

@Injectable()
export class ExternalApiChecker implements IServiceChecker {
  private readonly logger = new Logger(ExternalApiChecker.name);

  constructor(
    private readonly mylocaApiService: MylocaApiService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.logger.log('External API checker initialized for health monitoring');
  }

  async checkHealth(jwtToken?: string): Promise<ServiceHealthDto> {
    const startTime = Date.now();
    
    try {
      // Simple health check - test if external API is reachable
      // We'll use a basic endpoint that doesn't require authentication
      const baseUrl = this.configService.get<string>('EXTERNAL_API_BASE_URL') || 'https://mylocalisation.com';
      
      // Test basic connectivity to the external API
      await this.testExternalApiConnectivity(baseUrl);
      
      const responseTime = Date.now() - startTime;
      
      return {
        serviceName: 'MyLoca External API',
        serviceType: ServiceType.EXTERNAL_API,
        status: ServiceStatus.HEALTHY,
        message: 'External API is responsive',
        responseTime,
        lastChecked: new Date(),
        metadata: {
          endpoint: '/connectivity-test',
          baseUrl: this.configService.get<string>('EXTERNAL_API_BASE_URL'),
          authMethod: 'None'
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`External API health check failed: ${error.message}`, error.stack);
      
      // Determine status based on error type
      let status = ServiceStatus.DOWN;
      if (error.response?.status >= 500) {
        status = ServiceStatus.DOWN;
      } else if (error.response?.status >= 400) {
        status = ServiceStatus.DEGRADED;
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        status = ServiceStatus.DOWN;
      }
      
      return {
        serviceName: 'MyLoca External API',
        serviceType: ServiceType.EXTERNAL_API,
        status,
        message: 'External API connection failed',
        responseTime,
        lastChecked: new Date(),
        error: error.message,
        metadata: {
          errorCode: error.code,
          statusCode: error.response?.status,
          authMethod: 'None'
        }
      };
    }
  }

  private async testExternalApiConnectivity(baseUrl: string): Promise<void> {
    try {
      // Use HttpService directly to test connectivity without authentication
      // This bypasses MylocaApiService and its authentication requirements
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/health`, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      
      this.logger.debug('External API connectivity test successful');
    } catch (error: any) {
      // Check if it's a 401 (which means the service is reachable but requires auth)
      if (error.response?.status === 401) {
        this.logger.debug('External API is reachable (received 401 - service requires auth but is responsive)');
        return; // This is actually success for our connectivity test
      }
      
      // For any other error, it indicates real connectivity issues
      this.logger.error(`External API connectivity test failed: ${error.message}`);
      throw new Error(`External API unreachable: ${error.message}`);
    }
  }

  async checkDetailedHealth(jwtToken?: string): Promise<ServiceHealthDto> {
    const startTime = Date.now();
    
    try {
      // For detailed health check, just test basic connectivity
      const baseUrl = this.configService.get<string>('EXTERNAL_API_BASE_URL') || 'https://mylocalisation.com';
      await this.testExternalApiConnectivity(baseUrl);
      const responseTime = Date.now() - startTime;
      
      return {
        serviceName: 'MyLoca External API',
        serviceType: ServiceType.EXTERNAL_API,
        status: ServiceStatus.HEALTHY,
        message: 'External API is reachable (connectivity verified)',
        responseTime,
        lastChecked: new Date(),
        metadata: {
          endpoints: {
            connectivity: 'success'
          },
          detailedCheck: true,
          authMethod: 'None'
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`External API detailed health check failed: ${error.message}`, error.stack);
      
      return {
        serviceName: 'MyLoca External API',
        serviceType: ServiceType.EXTERNAL_API,
        status: ServiceStatus.DOWN,
        message: 'External API detailed check failed',
        responseTime,
        lastChecked: new Date(),
        error: error.message
      };
    }
  }

  async getMetrics(jwtToken?: string): Promise<Record<string, any>> {
    try {
      // Return basic connectivity metrics without authentication
      const baseUrl = this.configService.get<string>('EXTERNAL_API_BASE_URL') || 'https://mylocalisation.com';
      
      try {
        await this.testExternalApiConnectivity(baseUrl);
        return {
          message: 'External API connectivity verified',
          timestamp: new Date(),
          availability: {
            connectivity: true
          },
          authMethod: 'None',
          baseUrl
        };
      } catch (error) {
        return {
          message: 'External API connectivity failed',
          timestamp: new Date(),
          availability: {
            connectivity: false
          },
          authMethod: 'None',
          baseUrl,
          error: error.message
        };
      }
    } catch (error) {
      this.logger.error(`Failed to get external API metrics: ${error.message}`);
      return {
        error: error.message,
        timestamp: new Date(),
        authMethod: 'None'
      };
    }
  }

  getServiceName(): string {
    return 'MyLoca External API';
  }

  getServiceType(): string {
    return ServiceType.EXTERNAL_API;
  }
}
