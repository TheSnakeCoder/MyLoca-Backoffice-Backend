import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExternalApiService } from '../external-api/external-api.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('admin-oversight/notifications')
@UseGuards(JwtAuthGuard)
export class AdminNotificationsController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  @Get('system')
  async getSystemNotifications(@GetCurrentUser('username') adminUsername?: string) {
    console.log(`Admin ${adminUsername} viewing system notifications`);
    return this.externalApiService.getSystemNotifications();
  }

  @Get('user/:userId')
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @GetCurrentUser('username') adminUsername?: string,
  ) {
    console.log(`Admin ${adminUsername} viewing notifications for user: ${userId}`);
    return this.externalApiService.getUserNotifications(userId, page, limit);
  }
}
