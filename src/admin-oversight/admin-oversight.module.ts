import { Module } from '@nestjs/common';
import { ExternalApiModule } from '../external-api/external-api.module';
import { AdminUsersController } from './admin-users.controller';
import { AdminLocationsController } from './admin-locations.controller';
import { AdminNotificationsController } from './admin-notifications.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminTestController } from './admin-test.controller';

@Module({
  imports: [ExternalApiModule],
  controllers: [
    AdminUsersController,
    AdminLocationsController,
    AdminNotificationsController,
    AdminDashboardController,
    AdminTestController,
  ],
})
export class AdminOversightModule {}
