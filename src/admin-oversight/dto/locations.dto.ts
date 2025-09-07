import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';
import { PaginationQueryDto, ApiResponseDto } from './common.dto';
import { UserDto } from './users.dto';

export class LocationHistoryQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Start date for filtering (ISO format)',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering (ISO format)',
    example: '2024-01-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class LocationDto {
  @ApiProperty({
    description: 'Location ID',
    example: 'location_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user_123',
  })
  userId: string;

  @ApiProperty({
    description: 'Latitude coordinate (decrypted for admin view)',
    example: 40.7128,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate (decrypted for admin view)',
    example: -74.0060,
  })
  longitude: number;

  @ApiProperty({
    description: 'Location accuracy in meters',
    example: 10.5,
    required: false,
  })
  accuracy?: number;

  @ApiProperty({
    description: 'Whether live location is enabled',
    example: true,
  })
  isLiveLocationOn: boolean;

  @ApiProperty({
    description: 'Whether location history is allowed',
    example: true,
  })
  allowLocationHistory: boolean;

  @ApiProperty({
    description: 'Privacy level for location sharing',
    example: 'ALL_FRIENDS',
    enum: ['ALL_FRIENDS', 'SELECTED_FRIENDS', 'NOBODY'],
  })
  privacyLevel: string;

  @ApiProperty({
    description: 'Selected friend IDs for SELECTED_FRIENDS privacy level',
    example: ['user_456', 'user_789'],
    type: [String],
  })
  selectedFriendIds: string[];

  @ApiProperty({
    description: 'Live location expiration timestamp',
    example: '2024-01-15T12:30:00.000Z',
    required: false,
  })
  expiresAt?: string;

  @ApiProperty({
    description: 'Location last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  lastUpdated: string;

  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  user: UserDto;
}

export class FavoriteLocationDto {
  @ApiProperty({
    description: 'Favorite location ID',
    example: 'fav_location_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user_123',
  })
  userId: string;

  @ApiProperty({
    description: 'Location name',
    example: 'Central Park',
  })
  name: string;

  @ApiProperty({
    description: 'Location description',
    example: 'Great place for morning runs',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Latitude coordinate (decrypted for admin view)',
    example: 40.7829,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate (decrypted for admin view)',
    example: -73.9654,
  })
  longitude: number;

  @ApiProperty({
    description: 'Location address',
    example: 'Central Park, New York, NY 10024',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Location category',
    example: 'Park',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'Privacy level for favorite location',
    example: 'ALL_FRIENDS',
    enum: ['ALL_FRIENDS', 'SELECTED_FRIENDS', 'NOBODY'],
  })
  privacyLevel: string;

  @ApiProperty({
    description: 'Selected friend IDs for sharing',
    example: ['user_456', 'user_789'],
    type: [String],
  })
  selectedFriendIds: string[];

  @ApiProperty({
    description: 'Proximity distance in meters',
    example: 100,
  })
  proximityDistance: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  user: UserDto;
}

export class LocationHistoryDto {
  @ApiProperty({
    description: 'Location history ID',
    example: 'history_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user_123',
  })
  userId: string;

  @ApiProperty({
    description: 'Latitude coordinate (decrypted for admin view)',
    example: 40.7128,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate (decrypted for admin view)',
    example: -74.0060,
  })
  longitude: number;

  @ApiProperty({
    description: 'Location accuracy in meters',
    example: 10.5,
    required: false,
  })
  accuracy?: number;

  @ApiProperty({
    description: 'Timestamp of location record',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  user: UserDto;
}

export class CacheStatusDto {
  @ApiProperty({
    description: 'Whether Redis is available',
    example: true,
  })
  isRedisAvailable: boolean;

  @ApiProperty({
    description: 'Total memory cache entries',
    example: 1250,
  })
  totalMemoryCacheEntries: number;

  @ApiProperty({
    description: 'Redis cache hits',
    example: 8945,
  })
  redisHits: number;

  @ApiProperty({
    description: 'Memory cache hits',
    example: 2341,
  })
  memoryHits: number;

  @ApiProperty({
    description: 'Cache misses',
    example: 156,
  })
  misses: number;

  @ApiProperty({
    description: 'Redis errors count',
    example: 3,
  })
  redisErrors: number;

  @ApiProperty({
    description: 'Cache hit rate percentage',
    example: '96.2%',
  })
  hitRate: string;

  @ApiProperty({
    description: 'Current cache strategy',
    example: 'Redis primary with memory fallback',
  })
  cacheStrategy: string;

  @ApiProperty({
    description: 'Redis connection status',
    example: 'connected',
  })
  redisConnectionStatus: string;

  @ApiProperty({
    description: 'Batch queue size',
    example: 12,
  })
  batchQueueSize: number;

  @ApiProperty({
    description: 'Last health check timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  lastHealthCheck: string;
}

export class LocationStatusResponseDto extends ApiResponseDto<LocationDto[]> {}

export class LocationsResponseDto extends ApiResponseDto<LocationDto[]> {}

export class LocationSettingsResponseDto extends ApiResponseDto<LocationDto[]> {}

export class FavoriteLocationsResponseDto extends ApiResponseDto<FavoriteLocationDto[]> {}

export class LocationHistoryResponseDto extends ApiResponseDto<LocationHistoryDto[]> {}

export class LocationDetailsResponseDto {
  @ApiProperty({
    description: 'Location information with decrypted coordinates',
    type: LocationDto,
  })
  data: LocationDto;
}
