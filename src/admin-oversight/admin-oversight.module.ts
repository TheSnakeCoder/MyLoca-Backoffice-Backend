import { Module } from '@nestjs/common';
import { MylocaApiModule } from '../myloca-api/myloca-api.module';
import { AdminUsersController } from './admin-users.controller';
import { AdminLocationsController } from './admin-locations.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminFriendsController } from './admin-friends.controller';

@Module({
  imports: [MylocaApiModule],
  controllers: [
    AdminUsersController,
    AdminLocationsController,
    AdminDashboardController,
    AdminFriendsController,
  ],
  providers: [],
})
export class AdminOversightModule {}
