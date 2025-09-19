import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ServiceMonitorService } from './service-monitor.service';
import { ServiceMonitorController } from './service-monitor.controller';
import { DatabaseChecker } from './checkers/database.checker';
import { ExternalApiChecker } from './checkers/external-api.checker';
import { InternalServicesChecker } from './checkers/internal-services.checker';
import { AlertNotificationAction } from './actions/alert-notification.action';
import { PrismaModule } from '../prisma/prisma.module';
import { MylocaApiModule } from '../myloca-api/myloca-api.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable scheduled tasks
    HttpModule, // Provides HttpService for external API calls
    PrismaModule,
    MylocaApiModule,
  ],
  controllers: [ServiceMonitorController],
  providers: [
    ServiceMonitorService,
    // Service Checkers
    DatabaseChecker,
    ExternalApiChecker,
    InternalServicesChecker,
    // Auto Actions
    AlertNotificationAction,
  ],
  exports: [
    ServiceMonitorService,
    DatabaseChecker,
    ExternalApiChecker,
    InternalServicesChecker,
  ],
})
export class ServiceMonitorModule {}
