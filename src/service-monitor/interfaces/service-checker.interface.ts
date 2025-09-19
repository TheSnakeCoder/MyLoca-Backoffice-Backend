import { ServiceHealthDto } from '../dto/service-status.dto';

export interface IServiceChecker {
  /**
   * Check the health of a specific service
   */
  checkHealth(jwtToken?: string): Promise<ServiceHealthDto>;

  /**
   * Get service name
   */
  getServiceName(): string;

  /**
   * Get service type
   */
  getServiceType(): string;

  /**
   * Perform a detailed health check with metrics
   */
  checkDetailedHealth?(jwtToken?: string): Promise<ServiceHealthDto>;

  /**
   * Get service-specific metrics
   */
  getMetrics?(jwtToken?: string): Promise<Record<string, any>>;
}

export interface IAutoAction {
  /**
   * Execute an automated action
   */
  execute(context: ActionContext): Promise<ActionResult>;

  /**
   * Check if this action can handle the given condition
   */
  canHandle(condition: string, serviceName: string): boolean;

  /**
   * Get action description
   */
  getDescription(): string;
}

export interface ActionContext {
  serviceName: string;
  condition: string;
  serviceHealth: ServiceHealthDto;
  metadata?: Record<string, any>;
}

export interface ActionResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
}

export interface MonitoringConfig {
  enabled: boolean;
  checkInterval: number; // in seconds
  retryAttempts: number;
  timeout: number; // in milliseconds
  alerting: {
    enabled: boolean;
    responseTimeThreshold: number;
    errorRateThreshold: number;
    uptimeThreshold: number;
  };
  autoActions: {
    enabled: boolean;
    actions: string[];
  };
}
