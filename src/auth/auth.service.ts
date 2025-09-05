import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { username, isActive: true },
    });

    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password: _, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateAdmin(loginDto.username, loginDto.password);
    
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, username: admin.username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      payload,
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }
    );

    // Save refresh token to database
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    });

    return {
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        username: admin.username,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub },
      });

      if (!admin || !admin.refreshToken || !await bcrypt.compare(refreshToken, admin.refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: admin.id, username: admin.username };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(adminId: string) {
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }

  async createAdmin(createAdminDto: CreateAdminDto, createdByAdminId?: string) {
    // Check if username already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { username: createAdminDto.username },
    });

    if (existingAdmin) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 12);

    // Use transaction to create admin and potentially delete default admin
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create the new admin
      const admin = await prisma.admin.create({
        data: {
          username: createAdminDto.username,
          password: hashedPassword,
          isActive: createAdminDto.isActive ?? true,
          addedBy: createdByAdminId,
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      // If this admin was created by another admin (not system), delete default admin
      if (createdByAdminId) {
        const defaultAdmin = await prisma.admin.findUnique({
          where: { username: 'admin' },
        });

        if (defaultAdmin && defaultAdmin.id !== admin.id) {
          await prisma.admin.delete({
            where: { id: defaultAdmin.id },
          });
          this.logger.log('Default admin deleted after creating new admin');
        }
      }

      return admin;
    });

    this.logger.log(`Admin created: ${result.username} ${createdByAdminId ? `by admin ${createdByAdminId}` : '(system)'}`);

    const { password: _, refreshToken: __, ...adminResult } = result;
    return adminResult;
  }

  async createDefaultAdmin() {
    const adminCount = await this.prisma.admin.count();
    
    if (adminCount === 0) {
      const defaultAdmin = await this.createAdmin({
        username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
        isActive: true,
      }); // No createdByAdminId for system-created admin
      
      this.logger.log(`Default admin created with username: ${process.env.DEFAULT_ADMIN_USERNAME || 'admin'}, password: ${process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'}`);
      return defaultAdmin;
    }
    
    return null;
  }


  async getAllAdmins() {
    const admins = await this.prisma.admin.findMany({
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
    return admins;
  }

  async getAdminById(id: string) {
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
    return admin;
  }
}
