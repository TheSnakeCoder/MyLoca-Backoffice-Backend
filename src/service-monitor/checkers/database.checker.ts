import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IServiceChecker } from '../interfaces/service-checker.interface';
import { ServiceHealthDto, ServiceStatus, ServiceType } from '../dto/service-status.dto';

@Injectable()
export class DatabaseChecker implements IServiceChecker {
  private readonly logger = new Logger(DatabaseChecker.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkHealth(jwtToken?: string): Promise<ServiceHealthDto> {
    const startTime = Date.now();
    
    try {
      // Test database connection with a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      
      const responseTime = Date.now() - startTime;
      
      return {
        serviceName: 'PostgreSQL Database',
        serviceType: ServiceType.DATABASE,
        status: ServiceStatus.HEALTHY,
        message: 'Database connection successful',
        responseTime,
        lastChecked: new Date(),
        metadata: {
          connectionPool: 'active',
          queryExecuted: 'SELECT 1'
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Database health check failed: ${error.message}`, error.stack);
      
      return {
        serviceName: 'PostgreSQL Database',
        serviceType: ServiceType.DATABASE,
        status: ServiceStatus.DOWN,
        message: 'Database connection failed',
        responseTime,
        lastChecked: new Date(),
        error: error.message
      };
    }
  }

  async checkDetailedHealth(jwtToken?: string): Promise<ServiceHealthDto> {
    const startTime = Date.now();
    
    try {
      // Perform multiple checks for detailed health
      const [connectionTest, tableCount, adminCount] = await Promise.all([
        this.prisma.$queryRaw`SELECT version() as version`,
        this.prisma.$queryRaw`
          SELECT count(*) as table_count 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `,
        this.prisma.admin.count()
      ]);

      const responseTime = Date.now() - startTime;
      
      return {
        serviceName: 'PostgreSQL Database',
        serviceType: ServiceType.DATABASE,
        status: ServiceStatus.HEALTHY,
        message: 'Database detailed check successful',
        responseTime,
        lastChecked: new Date(),
        metadata: {
          version: connectionTest,
          tableCount,
          adminCount,
          detailedCheck: true
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Database detailed health check failed: ${error.message}`, error.stack);
      
      return {
        serviceName: 'PostgreSQL Database',
        serviceType: ServiceType.DATABASE,
        status: ServiceStatus.DOWN,
        message: 'Database detailed check failed',
        responseTime,
        lastChecked: new Date(),
        error: error.message
      };
    }
  }

  async getMetrics(jwtToken?: string): Promise<Record<string, any>> {
    try {
      const [connectionInfo, databaseSize] = await Promise.all([
        this.prisma.$queryRaw`
          SELECT 
            count(*) as total_connections,
            count(CASE WHEN state = 'active' THEN 1 END) as active_connections
          FROM pg_stat_activity
        `,
        this.prisma.$queryRaw`
          SELECT pg_size_pretty(pg_database_size(current_database())) as size
        `
      ]);

      return {
        connections: connectionInfo,
        databaseSize,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error(`Failed to get database metrics: ${error.message}`);
      return {
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  getServiceName(): string {
    return 'PostgreSQL Database';
  }

  getServiceType(): string {
    return ServiceType.DATABASE;
  }
}
