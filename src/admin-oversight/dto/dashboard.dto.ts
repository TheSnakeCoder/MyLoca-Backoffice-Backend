import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class DashboardActivityQueryDto {
  @ApiProperty({
    description: 'Number of items per category to return',
    example: 10,
    minimum: 1,
    maximum: 50,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class UserAnalyticsQueryDto {
  @ApiProperty({
    description: 'Analysis period in days',
    example: 30,
    minimum: 1,
    maximum: 365,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(365)
  days?: number;
}

export class UserStatsDto {
  @ApiProperty({
    description: 'Total number of users',
    example: 1250,
  })
  total: number;

  @ApiProperty({
    description: 'Number of active users',
    example: 980,
  })
  active: number;

  @ApiProperty({
    description: 'Number of inactive users',
    example: 270,
  })
  inactive: number;
}

export class FriendshipStatsDto {
  @ApiProperty({
    description: 'Total number of friendships',
    example: 2340,
  })
  total: number;

  @ApiProperty({
    description: 'Number of pending friend requests',
    example: 85,
  })
  pending: number;
}

export class LocationStatsDto {
  @ApiProperty({
    description: 'Total number of location records',
    example: 856,
  })
  total: number;

  @ApiProperty({
    description: 'Number of users with live location enabled',
    example: 342,
  })
  live: number;

  @ApiProperty({
    description: 'Number of users with live location disabled',
    example: 514,
  })
  offline: number;
}

export class DashboardStatsResponseDto {
  @ApiProperty({
    description: 'User statistics',
    type: UserStatsDto,
  })
  users: UserStatsDto;

  @ApiProperty({
    description: 'Friendship statistics',
    type: FriendshipStatsDto,
  })
  friendships: FriendshipStatsDto;

  @ApiProperty({
    description: 'Location statistics',
    type: LocationStatsDto,
  })
  locations: LocationStatsDto;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;
}

export class RecentUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user_123',
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Registration date',
    example: '2024-01-15T08:30:00.000Z',
  })
  createdAt: string;
}

export class RecentFriendshipDto {
  @ApiProperty({
    description: 'Friendship ID',
    example: 'friendship_456',
  })
  id: string;

  @ApiProperty({
    description: 'Friendship status',
    example: 'ACCEPTED',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
  })
  status: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T09:15:00.000Z',
  })
  createdAt: string;
}

export class RecentLocationDto {
  @ApiProperty({
    description: 'Location ID',
    example: 'loc_789',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user_123',
  })
  userId: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 40.7128,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -74.0060,
  })
  longitude: number;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:25:00.000Z',
  })
  lastUpdated: string;
}

export class DashboardActivityResponseDto {
  @ApiProperty({
    description: 'Recently registered users',
    type: [RecentUserDto],
  })
  recentUsers: RecentUserDto[];

  @ApiProperty({
    description: 'Recent friendship activities',
    type: [RecentFriendshipDto],
  })
  recentFriendships: RecentFriendshipDto[];

  @ApiProperty({
    description: 'Recent location updates',
    type: [RecentLocationDto],
  })
  recentLocations: RecentLocationDto[];
}

export class DayAnalyticsDto {
  @ApiProperty({
    description: 'Date',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Count for the day',
    example: 25,
  })
  count: number;
}

export class UserAnalyticsResponseDto {
  @ApiProperty({
    description: 'Daily user registration data',
    type: [DayAnalyticsDto],
  })
  userGrowthByDay: DayAnalyticsDto[];

  @ApiProperty({
    description: 'Daily friendship formation data',
    type: [DayAnalyticsDto],
  })
  friendshipGrowthByDay: DayAnalyticsDto[];
}

export class PrivacyLevelStatsDto {
  @ApiProperty({
    description: 'Privacy level',
    example: 'ALL_FRIENDS',
    enum: ['ALL_FRIENDS', 'SELECTED_FRIENDS', 'NOBODY'],
  })
  privacyLevel: string;

  @ApiProperty({
    description: 'Number of users with this privacy level',
    example: 450,
  })
  count: number;
}

export class CategoryStatsDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Restaurant',
  })
  category: string;

  @ApiProperty({
    description: 'Number of favorite locations in this category',
    example: 125,
  })
  count: number;
}

export class LocationAnalyticsResponseDto {
  @ApiProperty({
    description: 'Privacy level distribution',
    type: [PrivacyLevelStatsDto],
  })
  locationPrivacyStats: PrivacyLevelStatsDto[];

  @ApiProperty({
    description: 'Favorite location categories breakdown',
    type: [CategoryStatsDto],
  })
  favoriteLocationCategories: CategoryStatsDto[];

  @ApiProperty({
    description: 'Live location usage patterns',
    type: Object,
  })
  liveLocationUsage: Record<string, any>;
}
