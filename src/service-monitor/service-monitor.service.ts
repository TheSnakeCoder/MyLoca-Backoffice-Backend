import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { IServiceChecker, IAutoAction, MonitoringConfig } from './interfaces/service-checker.interface';
import { DatabaseChecker } from './checkers/database.checker';
import { ExternalApiChecker } from './checkers/external-api.checker';
import { InternalServicesChecker } from './checkers/internal-services.checker';
import { AlertNotificationAction } from './actions/alert-notification.action';
import { 
  ServiceHealthDto, 
  SystemHealthDto, 
  ServiceStatus, 
  ServiceMetricsDto,
  AutoActionDto 
} from './dto/service-status.dto';

@Injectable()
export class ServiceMonitorService implements OnModuleInit {
  private readonly logger = new Logger(ServiceMonitorService.name);
  private readonly serviceCheckers: IServiceChecker[] = [];
  private readonly autoActions: IAutoAction[] = [];
  private readonly serviceHistory: Map<string, ServiceHealthDto[]> = new Map();
  private readonly systemStartTime = Date.now();
  private monitoringConfig: MonitoringConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseChecker: DatabaseChecker,
    private readonly externalApiChecker: ExternalApiChecker,
    private readonly internalServicesChecker: InternalServicesChecker,
    private readonly alertNotificationAction: AlertNotificationAction,
  ) {
    this.initializeMonitoringConfig();
    this.registerServiceCheckers();
    this.registerAutoActions();
  }

  async onModuleInit() {
    this.logger.log('Service Monitor initialized');
    
    if (this.monitoringConfig.enabled) {
      this.logger.log('Starting initial health check...');
      await this.performHealthCheck();
    }
  }

  private initializeMonitoringConfig() {
    this.monitoringConfig = {
      enabled: this.configService.get<boolean>('MONITORING_ENABLED', true),
      checkInterval: this.configService.get<number>('MONITORING_CHECK_INTERVAL', 60), // 1 minute
      retryAttempts: this.configService.get<number>('MONITORING_RETRY_ATTEMPTS', 3),
      timeout: this.configService.get<number>('MONITORING_TIMEOUT', 30000), // 30 seconds
      alerting: {
        enabled: this.configService.get<boolean>('MONITORING_ALERTING_ENABLED', true),
        responseTimeThreshold: this.configService.get<number>('MONITORING_RESPONSE_TIME_THRESHOLD', 5000),
        errorRateThreshold: this.configService.get<number>('MONITORING_ERROR_RATE_THRESHOLD', 10),
        uptimeThreshold: this.configService.get<number>('MONITORING_UPTIME_THRESHOLD', 95)
      },
      autoActions: {
        enabled: this.configService.get<boolean>('MONITORING_AUTO_ACTIONS_ENABLED', true),
        actions: this.configService.get<string>('MONITORING_AUTO_ACTIONS', 'restart,alert').split(',')
      }
    };
  }

  private registerServiceCheckers() {
    this.serviceCheckers.push(
      this.databaseChecker,
      this.externalApiChecker,
      this.internalServicesChecker
    );
  }

  private registerAutoActions() {
    this.autoActions.push(
      this.alertNotificationAction
    );
  }

  // Scheduled health check every minute (configurable)
  @Cron('0 * * * * *') // Every minute
  async scheduledHealthCheck() {
    if (!this.monitoringConfig.enabled) {
      return;
    }

    try {
      await this.performHealthCheck();
    } catch (error) {
      this.logger.error(`Scheduled health check failed: ${error.message}`, error.stack);
    }
  }

  async performHealthCheck(jwtToken?: string): Promise<SystemHealthDto> {
    this.logger.debug('Performing system health check...');
    
    const healthChecks = await Promise.allSettled(
      this.serviceCheckers.map(checker => this.checkServiceWithRetry(checker, jwtToken))
    );

    const services: ServiceHealthDto[] = healthChecks.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          serviceName: this.serviceCheckers[index].getServiceName(),
          serviceType: this.serviceCheckers[index].getServiceType() as any,
          status: ServiceStatus.UNKNOWN,
          message: 'Health check failed',
          lastChecked: new Date(),
          error: result.reason?.message || 'Unknown error'
        };
      }
    });

    // Store history
    services.forEach(service => {
      this.addToHistory(service);
    });

    // Calculate overall status
    const overallStatus = this.calculateOverallStatus(services);
    
    const systemHealth: SystemHealthDto = {
      overallStatus,
      services,
      totalServices: services.length,
      healthyServices: services.filter(s => s.status === ServiceStatus.HEALTHY).length,
      degradedServices: services.filter(s => s.status === ServiceStatus.DEGRADED).length,
      downServices: services.filter(s => s.status === ServiceStatus.DOWN).length,
      systemUptime: Math.floor((Date.now() - this.systemStartTime) / 1000),
      lastFullCheck: new Date()
    };

    // Trigger auto actions if needed
    if (this.monitoringConfig.autoActions.enabled) {
      await this.triggerAutoActions(services);
    }

    this.logger.debug(`Health check completed. Overall status: ${overallStatus}`);
    return systemHealth;
  }

  private async checkServiceWithRetry(checker: IServiceChecker, jwtToken?: string): Promise<ServiceHealthDto> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= this.monitoringConfig.retryAttempts; attempt++) {
      try {
        const result = await checker.checkHealth(jwtToken);
        if (result.status !== ServiceStatus.DOWN) {
          return result;
        }
        lastError = new Error(result.error || 'Service is down');
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.monitoringConfig.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }
    
    throw lastError || new Error('Health check failed after retries');
  }

  private calculateOverallStatus(services: ServiceHealthDto[]): ServiceStatus {
    const downServices = services.filter(s => s.status === ServiceStatus.DOWN).length;
    const degradedServices = services.filter(s => s.status === ServiceStatus.DEGRADED).length;
    
    if (downServices > 0) {
      return ServiceStatus.DOWN;
    } else if (degradedServices > 0) {
      return ServiceStatus.DEGRADED;
    } else {
      return ServiceStatus.HEALTHY;
    }
  }

  private addToHistory(service: ServiceHealthDto) {
    const serviceName = service.serviceName;
    if (!this.serviceHistory.has(serviceName)) {
      this.serviceHistory.set(serviceName, []);
    }
    
    const history = this.serviceHistory.get(serviceName);
    if (history) {
      history.push(service);
      
      // Keep only last 100 entries per service
      if (history.length > 100) {
        history.shift();
      }
    }
  }

  private async triggerAutoActions(services: ServiceHealthDto[]) {
    const problematicServices = services.filter(s => 
      s.status === ServiceStatus.DOWN || s.status === ServiceStatus.DEGRADED
    );

    for (const service of problematicServices) {
      const applicableActions = this.autoActions.filter(action => 
        action.canHandle(service.status, service.serviceName)
      );

      for (const action of applicableActions) {
        try {
          const result = await action.execute({
            serviceName: service.serviceName,
            condition: service.status,
            serviceHealth: service,
            metadata: service.metadata
          });

          this.logger.log(`Auto action executed: ${action.getDescription()}`, {
            serviceName: service.serviceName,
            success: result.success,
            message: result.message
          });
        } catch (error) {
          this.logger.error(`Auto action failed: ${error.message}`, error.stack);
        }
      }
    }
  }

  async getSystemHealth(jwtToken?: string): Promise<SystemHealthDto> {
    return this.performHealthCheck(jwtToken);
  }

  async getServiceHealth(serviceName: string, jwtToken?: string): Promise<ServiceHealthDto | null> {
    const checker = this.serviceCheckers.find(c => c.getServiceName() === serviceName);
    if (!checker) {
      return null;
    }

    try {
      return await checker.checkHealth(jwtToken);
    } catch (error) {
      return {
        serviceName,
        serviceType: checker.getServiceType() as any,
        status: ServiceStatus.UNKNOWN,
        message: 'Health check failed',
        lastChecked: new Date(),
        error: error.message
      };
    }
  }

  async getServiceMetrics(serviceName?: string): Promise<ServiceMetricsDto[]> {
    const checkers = serviceName 
      ? this.serviceCheckers.filter(c => c.getServiceName() === serviceName)
      : this.serviceCheckers;

    const metrics: ServiceMetricsDto[] = [];

    for (const checker of checkers) {
      try {
        const history = this.serviceHistory.get(checker.getServiceName()) || [];
        const lastHour = history.filter(h => 
          h.lastChecked.getTime() > Date.now() - 60 * 60 * 1000
        );

        const avgResponseTime = lastHour.length > 0 
          ? lastHour.reduce((sum, h) => sum + (h.responseTime || 0), 0) / lastHour.length
          : 0;

        const errorCount = lastHour.filter(h => 
          h.status === ServiceStatus.DOWN || h.status === ServiceStatus.DEGRADED
        ).length;

        const successRate = lastHour.length > 0 
          ? ((lastHour.length - errorCount) / lastHour.length) * 100
          : 100;

        metrics.push({
          serviceName: checker.getServiceName(),
          avgResponseTime: Math.round(avgResponseTime),
          requestCount: lastHour.length,
          errorCount,
          successRate: Math.round(successRate * 100) / 100
        });
      } catch (error) {
        this.logger.error(`Failed to get metrics for ${checker.getServiceName()}: ${error.message}`);
      }
    }

    return metrics;
  }

  async getServiceHistory(serviceName: string, limit = 50): Promise<ServiceHealthDto[]> {
    const history = this.serviceHistory.get(serviceName) || [];
    return history.slice(-limit);
  }

  getMonitoringConfig(): MonitoringConfig {
    return { ...this.monitoringConfig };
  }

  async updateMonitoringConfig(config: Partial<MonitoringConfig>): Promise<MonitoringConfig> {
    this.monitoringConfig = { ...this.monitoringConfig, ...config };
    this.logger.log('Monitoring configuration updated', config);
    return this.monitoringConfig;
  }

  getRegisteredServices(): string[] {
    return this.serviceCheckers.map(checker => checker.getServiceName());
  }

  getAvailableActions(): string[] {
    return this.autoActions.map(action => action.getDescription());
  }
}
