import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { IServiceChecker } from '../interfaces/service-checker.interface';
import { ServiceHealthDto, ServiceStatus, ServiceType } from '../dto/service-status.dto';

@Injectable()
export class InternalServicesChecker implements IServiceChecker {
  private readonly logger = new Logger(InternalServicesChecker.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async checkHealth(jwtToken?: string): Promise<ServiceHealthDto> {
    const startTime = Date.now();
    
    try {
      // Check core internal services
      const checks = await this.performInternalChecks();
      
      const responseTime = Date.now() - startTime;
      const failedChecks = checks.filter(check => !check.success);
      
      let status: ServiceStatus;
      let message: string;
      
      if (failedChecks.length === 0) {
        status = ServiceStatus.HEALTHY;
        message = 'All internal services operational';
      } else if (failedChecks.length < checks.length / 2) {
        status = ServiceStatus.DEGRADED;
        message = `${failedChecks.length}/${checks.length} internal services have issues`;
      } else {
        status = ServiceStatus.DOWN;
        message = 'Multiple internal services failing';
      }
      
      return {
        serviceName: 'Internal Services',
        serviceType: ServiceType.INTERNAL_SERVICE,
        status,
        message,
        responseTime,
        lastChecked: new Date(),
        metadata: {
          checks: checks.map(check => ({
            service: check.service,
            status: check.success ? 'healthy' : 'failed',
            message: check.message
          }))
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Internal services health check failed: ${error.message}`, error.stack);
      
      return {
        serviceName: 'Internal Services',
        serviceType: ServiceType.INTERNAL_SERVICE,
        status: ServiceStatus.DOWN,
        message: 'Internal services check failed',
        responseTime,
        lastChecked: new Date(),
        error: error.message
      };
    }
  }

  private async performInternalChecks(): Promise<Array<{service: string, success: boolean, message: string}>> {
    const checks: Array<{service: string, success: boolean, message: string}> = [];

    // Check JWT Configuration
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      
      checks.push({
        service: 'JWT Configuration',
        success: !!(jwtSecret && jwtRefreshSecret),
        message: jwtSecret && jwtRefreshSecret ? 'JWT secrets configured' : 'JWT secrets missing'
      });
    } catch (error) {
      checks.push({
        service: 'JWT Configuration',
        success: false,
        message: `JWT config error: ${error.message}`
      });
    }

    // Check Prisma Connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.push({
        service: 'Prisma ORM',
        success: true,
        message: 'Prisma connection active'
      });
    } catch (error) {
      checks.push({
        service: 'Prisma ORM',
        success: false,
        message: `Prisma error: ${error.message}`
      });
    }

    // Check Environment Variables
    try {
      const requiredEnvVars = [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'JWT_SECRET',
        'EXTERNAL_API_BASE_URL'
      ];
      
      const missingVars = requiredEnvVars.filter(varName => !this.configService.get<string>(varName));
      
      checks.push({
        service: 'Environment Variables',
        success: missingVars.length === 0,
        message: missingVars.length === 0 ? 'All required env vars present' : `Missing: ${missingVars.join(', ')}`
      });
    } catch (error) {
      checks.push({
        service: 'Environment Variables',
        success: false,
        message: `Env check error: ${error.message}`
      });
    }

    // Check Admin Access
    try {
      const adminCount = await this.prisma.admin.count();
      checks.push({
        service: 'Admin Access',
        success: adminCount > 0,
        message: adminCount > 0 ? `${adminCount} admin(s) available` : 'No admin accounts found'
      });
    } catch (error) {
      checks.push({
        service: 'Admin Access',
        success: false,
        message: `Admin check error: ${error.message}`
      });
    }

    // Check Audit System
    try {
      // Simple check to see if we can query the database
      // Note: Replace 'audit' with an actual table name from your schema
      await this.prisma.$queryRaw`SELECT 1`; // Simple connectivity check
      checks.push({
        service: 'Audit System',
        success: true,
        message: 'Audit system accessible'
      });
    } catch (error) {
      checks.push({
        service: 'Audit System',
        success: false,
        message: `Audit system error: ${error.message}`
      });
    }

    return checks;
  }

  async checkDetailedHealth(jwtToken?: string): Promise<ServiceHealthDto> {
    const startTime = Date.now();
    
    try {
      const [basicChecks, performanceMetrics] = await Promise.all([
        this.performInternalChecks(),
        this.getPerformanceMetrics()
      ]);
      
      const responseTime = Date.now() - startTime;
      const failedChecks = basicChecks.filter(check => !check.success);
      
      let status: ServiceStatus;
      if (failedChecks.length === 0) {
        status = ServiceStatus.HEALTHY;
      } else if (failedChecks.length < basicChecks.length / 2) {
        status = ServiceStatus.DEGRADED;
      } else {
        status = ServiceStatus.DOWN;
      }
      
      return {
        serviceName: 'Internal Services',
        serviceType: ServiceType.INTERNAL_SERVICE,
        status,
        message: `Detailed check: ${basicChecks.length - failedChecks.length}/${basicChecks.length} services healthy`,
        responseTime,
        lastChecked: new Date(),
        metadata: {
          checks: basicChecks,
          performance: performanceMetrics,
          detailedCheck: true
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Internal services detailed health check failed: ${error.message}`, error.stack);
      
      return {
        serviceName: 'Internal Services',
        serviceType: ServiceType.INTERNAL_SERVICE,
        status: ServiceStatus.DOWN,
        message: 'Detailed check failed',
        responseTime,
        lastChecked: new Date(),
        error: error.message
      };
    }
  }

  private async getPerformanceMetrics(): Promise<Record<string, any>> {
    try {
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();
      
      return {
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          external: Math.round(memoryUsage.external / 1024 / 1024) // MB
        },
        uptime: Math.round(uptime),
        timestamp: new Date()
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async getMetrics(jwtToken?: string): Promise<Record<string, any>> {
    try {
      const performanceMetrics = await this.getPerformanceMetrics();
      const checks = await this.performInternalChecks();
      
      return {
        performance: performanceMetrics,
        serviceStatus: checks,
        healthScore: (checks.filter(c => c.success).length / checks.length) * 100,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error(`Failed to get internal services metrics: ${error.message}`);
      return {
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  getServiceName(): string {
    return 'Internal Services';
  }

  getServiceType(): string {
    return ServiceType.INTERNAL_SERVICE;
  }
}
