import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUserType, GetCurrentUser, GetCurrentUserId } from './decorators/get-current-user.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Admin login',
    description: 'Authenticate admin user and obtain access/refresh tokens',
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refresh_token: {
          type: 'string',
          description: 'JWT refresh token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          description: 'Admin user information',
          properties: {
            id: { type: 'string', example: 'admin_123' },
            username: { type: 'string', example: 'admin1' },
            isActive: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Get new access and refresh tokens using a valid refresh token',
  })
  @ApiResponse({
    status: 201,
    description: 'Token refresh successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'New JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refresh_token: {
          type: 'string',
          description: 'New JWT refresh token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin logout',
    description: 'Logout admin user and invalidate refresh tokens',
  })
  @ApiResponse({
    status: 201,
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logout successful',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current admin profile',
    description: 'Retrieve the authenticated admin user profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'admin_123' },
        username: { type: 'string', example: 'admin1' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  async getProfile(@GetCurrentUser() user: CurrentUserType) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new admin account',
    description: 'Create a new admin user account (requires existing admin authentication)',
  })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Admin created successfully',
        },
        admin: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'admin_456' },
            username: { type: 'string', example: 'admin3' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin privileges required',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or username already exists',
  })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.authService.createAdmin(createAdminDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admins')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all admin accounts',
    description: 'Retrieve list of all admin accounts (requires admin authentication)',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin accounts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'admin_123' },
          username: { type: 'string', example: 'admin1' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin privileges required',
  })
  async getAllAdmins() {
    return this.authService.getAllAdmins();
  }
}
