import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto, ApiResponseDto } from './common.dto';

export class UserSearchQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Search query for username',
    example: 'john',
    required: true,
  })
  @IsString()
  q: string;
}

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Profile picture URL',
    example: 'https://storage.googleapis.com/bucket/profile.jpg',
    required: false,
  })
  profilePicture?: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: string;
}

export class UserProfileDto extends UserDto {
  @ApiProperty({
    description: 'User location information',
    type: Object,
    required: false,
  })
  userLocation?: Record<string, any>;

  @ApiProperty({
    description: 'User favorite locations',
    type: [Object],
  })
  favoriteLocations: Record<string, any>[];

  @ApiProperty({
    description: 'User activity counts',
    type: Object,
  })
  _count: {
    sentFriendRequests: number;
    receivedFriendRequests: number;
    locationHistory: number;
  };
}

export class UserResponseDto extends ApiResponseDto<UserDto[]> {}

export class UserProfileResponseDto extends ApiResponseDto<UserProfileDto[]> {}

export class UserDetailsResponseDto {
  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  data: UserDto;
}

export class UserActionResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User deactivated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Updated user information',
    type: UserDto,
  })
  user: UserDto;
}
