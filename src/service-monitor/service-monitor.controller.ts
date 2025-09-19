import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  Query, 
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetJwtToken } from '../auth/decorators/get-jwt-token.decorator';
import { ServiceMonitorService } from './service-monitor.service';
import { 
  SystemHealthDto, 
  ServiceHealthDto, 
  ServiceMetricsDto,
  AlertConfigDto,
  AutoActionDto 
} from './dto/service-status.dto';
import { MonitoringConfig } from './interfaces/service-checker.interface';
import {
  ApiServiceMonitorController,
  ApiGetSystemHealth,
  ApiGetServiceHealth,
  ApiTriggerHealthCheck,
  ApiGetServiceMetrics,
  ApiGetServiceHistory,
  ApiGetRegisteredServices,
  ApiGetAvailableActions,
  ApiGetMonitoringConfig,
  ApiUpdateMonitoringConfig,
  ApiGetDashboardData,
  ApiGetStatusSummary,
  ApiGetHealthTrends,
} from './swagger/service-monitor.swagger';

@Controller('service-monitor')
@UseGuards(JwtAuthGuard)
@ApiServiceMonitorController()
export class ServiceMonitorController {

  constructor(private readonly serviceMonitorService: ServiceMonitorService) {}


  @Get('health')
  @ApiGetSystemHealth()
  async getSystemHealth(@GetJwtToken() jwtToken: string): Promise<SystemHealthDto> {
    return this.serviceMonitorService.getSystemHealth(jwtToken);
  }

  @Get('health/:serviceName')
  @ApiGetServiceHealth()
  async getServiceHealth(@Param('serviceName') serviceName: string, @GetJwtToken() jwtToken: string): Promise<ServiceHealthDto> {
    const health = await this.serviceMonitorService.getServiceHealth(serviceName, jwtToken);
    if (!health) {
      throw new Error(`Service '${serviceName}' not found`);
    }
    return health;
  }

  @Post('health/check')
  @ApiTriggerHealthCheck()
  @HttpCode(HttpStatus.OK)
  async triggerHealthCheck(@GetJwtToken() jwtToken: string): Promise<SystemHealthDto> {
    return this.serviceMonitorService.performHealthCheck(jwtToken);
  }

  @Get('metrics')
  @ApiGetServiceMetrics()
  async getServiceMetrics(
    @Query('serviceName') serviceName?: string
  ): Promise<ServiceMetricsDto[]> {
    return this.serviceMonitorService.getServiceMetrics(serviceName);
  }

  @Get('history/:serviceName')
  @ApiGetServiceHistory()
  async getServiceHistory(
    @Param('serviceName') serviceName: string,
    @Query('limit') limit?: number
  ): Promise<ServiceHealthDto[]> {
    return this.serviceMonitorService.getServiceHistory(serviceName, limit);
  }

  @Get('services')
  @ApiGetRegisteredServices()
  async getRegisteredServices(): Promise<string[]> {
    return this.serviceMonitorService.getRegisteredServices();
  }

  @Get('actions')
  @ApiGetAvailableActions()
  async getAvailableActions(): Promise<string[]> {
    return this.serviceMonitorService.getAvailableActions();
  }

  @Get('config')
  @ApiGetMonitoringConfig()
  async getMonitoringConfig(): Promise<MonitoringConfig> {
    return this.serviceMonitorService.getMonitoringConfig();
  }

  @Put('config')
  @ApiUpdateMonitoringConfig()
  async updateMonitoringConfig(
    @Body() config: Partial<MonitoringConfig>
  ): Promise<MonitoringConfig> {
    return this.serviceMonitorService.updateMonitoringConfig(config);
  }

  @Get('dashboard')
  @ApiGetDashboardData()
  async getDashboardData(@GetJwtToken() jwtToken: string): Promise<{
    systemHealth: SystemHealthDto;
    metrics: ServiceMetricsDto[];
    config: MonitoringConfig;
    services: string[];
    actions: string[];
  }> {
    const [systemHealth, metrics, config, services, actions] = await Promise.all([
      this.serviceMonitorService.getSystemHealth(jwtToken),
      this.serviceMonitorService.getServiceMetrics(),
      this.serviceMonitorService.getMonitoringConfig(),
      this.serviceMonitorService.getRegisteredServices(),
      this.serviceMonitorService.getAvailableActions()
    ]);

    return {
      systemHealth,
      metrics,
      config,
      services,
      actions
    };
  }

  @Get('status-summary')
  @ApiGetStatusSummary()
  async getStatusSummary(@GetJwtToken() jwtToken: string): Promise<{
    overallStatus: string;
    totalServices: number;
    healthyServices: number;
    issues: number;
    uptime: number;
    lastCheck: Date;
  }> {
    const systemHealth = await this.serviceMonitorService.getSystemHealth(jwtToken);
    
    return {
      overallStatus: systemHealth.overallStatus,
      totalServices: systemHealth.totalServices,
      healthyServices: systemHealth.healthyServices,
      issues: systemHealth.degradedServices + systemHealth.downServices,
      uptime: systemHealth.systemUptime,
      lastCheck: systemHealth.lastFullCheck
    };
  }

  @Get('health-trends')
  @ApiGetHealthTrends()
  async getHealthTrends(@Query('hours') hours = 24): Promise<{
    serviceName: string;
    trend: { timestamp: Date; status: string; responseTime?: number }[];
  }[]> {
    const services = this.serviceMonitorService.getRegisteredServices();
    const trends: {
      serviceName: string;
      trend: { timestamp: Date; status: string; responseTime?: number }[];
    }[] = [];

    for (const serviceName of services) {
      const history = await this.serviceMonitorService.getServiceHistory(serviceName, 100);
      const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
      
      const trend = history
        .filter(h => h.lastChecked.getTime() > cutoffTime)
        .map(h => ({
          timestamp: h.lastChecked,
          status: h.status,
          responseTime: h.responseTime
        }));

      trends.push({
        serviceName,
        trend
      });
    }

    return trends;
  }
}
