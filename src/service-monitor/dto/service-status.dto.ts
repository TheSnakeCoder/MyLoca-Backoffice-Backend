import { ApiProperty } from '@nestjs/swagger';

export enum ServiceStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  DOWN = 'DOWN',
  UNKNOWN = 'UNKNOWN'
}

export enum ServiceType {
  DATABASE = 'DATABASE',
  EXTERNAL_API = 'EXTERNAL_API',
  INTERNAL_SERVICE = 'INTERNAL_SERVICE',
  CACHE = 'CACHE',
  FILESYSTEM = 'FILESYSTEM'
}

export class ServiceHealthDto {
  @ApiProperty({ description: 'Service name identifier' })
  serviceName: string;

  @ApiProperty({ enum: ServiceType, description: 'Type of service' })
  serviceType: ServiceType;

  @ApiProperty({ enum: ServiceStatus, description: 'Current health status' })
  status: ServiceStatus;

  @ApiProperty({ description: 'Human-readable status message' })
  message: string;

  @ApiProperty({ description: 'Response time in milliseconds' })
  responseTime?: number;

  @ApiProperty({ description: 'Last check timestamp' })
  lastChecked: Date;

  @ApiProperty({ description: 'Service uptime percentage' })
  uptime?: number;

  @ApiProperty({ description: 'Additional service metadata' })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Error details if service is down' })
  error?: string;
}

export class SystemHealthDto {
  @ApiProperty({ enum: ServiceStatus, description: 'Overall system status' })
  overallStatus: ServiceStatus;

  @ApiProperty({ type: [ServiceHealthDto], description: 'Status of all services' })
  services: ServiceHealthDto[];

  @ApiProperty({ description: 'Total services monitored' })
  totalServices: number;

  @ApiProperty({ description: 'Number of healthy services' })
  healthyServices: number;

  @ApiProperty({ description: 'Number of degraded services' })
  degradedServices: number;

  @ApiProperty({ description: 'Number of down services' })
  downServices: number;

  @ApiProperty({ description: 'System uptime in seconds' })
  systemUptime: number;

  @ApiProperty({ description: 'Last full health check' })
  lastFullCheck: Date;
}

export class ServiceMetricsDto {
  @ApiProperty({ description: 'Service name' })
  serviceName: string;

  @ApiProperty({ description: 'Average response time over last hour' })
  avgResponseTime: number;

  @ApiProperty({ description: 'Request count in last hour' })
  requestCount: number;

  @ApiProperty({ description: 'Error count in last hour' })
  errorCount: number;

  @ApiProperty({ description: 'Success rate percentage' })
  successRate: number;

  @ApiProperty({ description: 'Memory usage if applicable' })
  memoryUsage?: number;

  @ApiProperty({ description: 'CPU usage if applicable' })
  cpuUsage?: number;
}

export class AlertConfigDto {
  @ApiProperty({ description: 'Service name to monitor' })
  serviceName: string;

  @ApiProperty({ description: 'Enable/disable alerting' })
  enabled: boolean;

  @ApiProperty({ description: 'Response time threshold in ms' })
  responseTimeThreshold?: number;

  @ApiProperty({ description: 'Error rate threshold percentage' })
  errorRateThreshold?: number;

  @ApiProperty({ description: 'Uptime threshold percentage' })
  uptimeThreshold?: number;

  @ApiProperty({ description: 'Alert notification channels' })
  notificationChannels?: string[];
}

export class AutoActionDto {
  @ApiProperty({ description: 'Action identifier' })
  actionId: string;

  @ApiProperty({ description: 'Service name this action applies to' })
  serviceName: string;

  @ApiProperty({ description: 'Trigger condition' })
  trigger: string;

  @ApiProperty({ description: 'Action to execute' })
  action: string;

  @ApiProperty({ description: 'Action executed timestamp' })
  executedAt: Date;

  @ApiProperty({ description: 'Action result' })
  result: 'SUCCESS' | 'FAILED' | 'PARTIAL';

  @ApiProperty({ description: 'Action details' })
  details?: string;
}
