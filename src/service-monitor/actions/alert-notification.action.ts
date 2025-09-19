import { Injectable, Logger } from '@nestjs/common';
import { IAutoAction, ActionContext, ActionResult } from '../interfaces/service-checker.interface';

@Injectable()
export class AlertNotificationAction implements IAutoAction {
  private readonly logger = new Logger(AlertNotificationAction.name);

  async execute(context: ActionContext): Promise<ActionResult> {
    this.logger.warn(`Sending alert for service: ${context.serviceName} - Condition: ${context.condition}`);
    
    try {
      const alertData = {
        serviceName: context.serviceName,
        condition: context.condition,
        timestamp: new Date(),
        serviceHealth: context.serviceHealth,
        metadata: context.metadata
      };

      // Send notifications through various channels
      const notifications = await Promise.allSettled([
        this.sendLogAlert(alertData),
        this.sendEmailAlert(alertData),
        this.sendSlackAlert(alertData)
      ]);

      const successfulNotifications = notifications.filter(n => n.status === 'fulfilled').length;
      const totalNotifications = notifications.length;

      return {
        success: successfulNotifications > 0,
        message: `Alert sent through ${successfulNotifications}/${totalNotifications} channels`,
        details: {
          notifications: notifications.map((n, index) => ({
            channel: ['log', 'email', 'slack'][index],
            status: n.status,
            result: n.status === 'fulfilled' ? 'success' : 'failed'
          })),
          alertData
        }
      };
    } catch (error) {
      this.logger.error(`Failed to send alert for ${context.serviceName}: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Alert sending failed: ${error.message}`,
        details: { error: error.message }
      };
    }
  }

  private async sendLogAlert(alertData: any): Promise<void> {
    // Log-based alerting (always available)
    this.logger.error(`SERVICE ALERT: ${alertData.serviceName} is ${alertData.condition}`, {
      serviceName: alertData.serviceName,
      condition: alertData.condition,
      timestamp: alertData.timestamp,
      responseTime: alertData.serviceHealth.responseTime,
      error: alertData.serviceHealth.error
    });
  }

  private async sendEmailAlert(alertData: any): Promise<void> {
    // Email alerting - in a real implementation, integrate with email service
    this.logger.debug(`Email alert would be sent for ${alertData.serviceName}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In production, you would integrate with services like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    // Example:
    // await this.emailService.send({
    //   to: 'admin@myloca.com',
    //   subject: `Service Alert: ${alertData.serviceName}`,
    //   body: this.formatEmailAlert(alertData)
    // });
  }

  private async sendSlackAlert(alertData: any): Promise<void> {
    // Slack alerting - in a real implementation, integrate with Slack API
    this.logger.debug(`Slack alert would be sent for ${alertData.serviceName}`);
    
    // Simulate Slack API call delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // In production, you would integrate with Slack webhook or API:
    // await this.slackService.sendMessage({
    //   channel: '#alerts',
    //   text: this.formatSlackAlert(alertData)
    // });
  }

  private formatEmailAlert(alertData: any): string {
    return `
🚨 Service Monitor Alert - Manual Intervention Required

Service: ${alertData.serviceName}
Status: ${alertData.condition}
Time: ${alertData.timestamp}
Response Time: ${alertData.serviceHealth.responseTime}ms

${alertData.serviceHealth.error ? `Error: ${alertData.serviceHealth.error}` : ''}

⚠️  MANUAL ACTION REQUIRED ⚠️
Please check the service status and restart manually if needed.
No automatic restart will be performed.

Check service status: /service-monitor/health/${encodeURIComponent(alertData.serviceName)}
    `.trim();
  }

  private formatSlackAlert(alertData: any): string {
    const emoji = alertData.condition === 'DOWN' ? '🔴' : '⚠️';
    return `${emoji} *Service Alert*: ${alertData.serviceName} is ${alertData.condition}\n⚠️ Manual intervention required - no automatic restart will be performed`;
  }

  canHandle(condition: string, serviceName: string): boolean {
    // This action handles all alertable conditions (manual restart required)
    return ['DOWN', 'DEGRADED', 'UNKNOWN'].includes(condition);
  }

  getDescription(): string {
    return 'Sends alerts through multiple notification channels when services have issues (manual intervention required)';
  }
}
