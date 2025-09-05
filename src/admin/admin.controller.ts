import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: { username?: string; password?: string; isActive?: boolean },
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUserId() currentUserId: string) {
    return this.adminService.remove(id, currentUserId);
  }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string, @GetCurrentUserId() currentUserId: string) {
    return this.adminService.toggleStatus(id, currentUserId);
  }
}
