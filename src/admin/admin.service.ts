import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        isActive: true,
        addedBy: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        isActive: true,
        addedBy: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        createdAdmins: {
          select: {
            id: true,
            username: true,
            createdAt: true,
          },
        },
      },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return admin;
  }

  async update(id: string, updateData: { username?: string; password?: string; isActive?: boolean }) {
    const admin = await this.findOne(id);

    // Check if username is being changed and if it already exists
    if (updateData.username && updateData.username !== admin.username) {
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { username: updateData.username },
      });

      if (existingAdmin) {
        throw new ConflictException('Username already exists');
      }
    }

    const updatePayload: any = {};

    if (updateData.username) {
      updatePayload.username = updateData.username;
    }

    if (updateData.password) {
      updatePayload.password = await bcrypt.hash(updateData.password, 12);
    }

    if (updateData.isActive !== undefined) {
      updatePayload.isActive = updateData.isActive;
    }

    const updatedAdmin = await this.prisma.admin.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        username: true,
        isActive: true,
        addedBy: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return updatedAdmin;
  }

  async remove(id: string, currentAdminId: string) {
    // Prevent admin from deleting themselves
    if (id === currentAdminId) {
      throw new ConflictException('Cannot delete your own account');
    }

    const admin = await this.findOne(id);

    // Check if this is the last admin
    const adminCount = await this.prisma.admin.count({ where: { isActive: true } });
    if (adminCount <= 1) {
      throw new ConflictException('Cannot delete the last active admin');
    }

    await this.prisma.admin.delete({
      where: { id },
    });

    return { message: `Admin ${admin.username} deleted successfully` };
  }

  async toggleStatus(id: string, currentAdminId: string) {
    // Prevent admin from deactivating themselves
    if (id === currentAdminId) {
      throw new ConflictException('Cannot deactivate your own account');
    }

    const admin = await this.findOne(id);

    // If deactivating, check if this would leave no active admins
    if (admin.isActive) {
      const activeAdminCount = await this.prisma.admin.count({ where: { isActive: true } });
      if (activeAdminCount <= 1) {
        throw new ConflictException('Cannot deactivate the last active admin');
      }
    }

    const updatedAdmin = await this.prisma.admin.update({
      where: { id },
      data: { isActive: !admin.isActive },
      select: {
        id: true,
        username: true,
        isActive: true,
        addedBy: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return updatedAdmin;
  }
}
