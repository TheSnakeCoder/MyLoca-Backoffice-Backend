import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto, ApiResponseDto } from './common.dto';
import { UserDto } from './users.dto';

export class FriendshipDto {
  @ApiProperty({
    description: 'Friendship ID',
    example: 'friendship_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Requester user ID',
    example: 'user_123',
  })
  requesterId: string;

  @ApiProperty({
    description: 'Requestee user ID',
    example: 'user_456',
  })
  requesteeId: string;

  @ApiProperty({
    description: 'Friendship status',
    example: 'ACCEPTED',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
  })
  status: string;

  @ApiProperty({
    description: 'Friendship creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Friendship last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Requester user information',
    type: UserDto,
  })
  requester: UserDto;

  @ApiProperty({
    description: 'Requestee user information',
    type: UserDto,
  })
  requestee: UserDto;
}

export class BlockDto {
  @ApiProperty({
    description: 'Block relationship ID',
    example: 'block_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Blocker user ID',
    example: 'user_123',
  })
  blockerId: string;

  @ApiProperty({
    description: 'Blocked user ID',
    example: 'user_456',
  })
  blockedId: string;

  @ApiProperty({
    description: 'Block creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Blocker user information',
    type: UserDto,
  })
  blocker: UserDto;

  @ApiProperty({
    description: 'Blocked user information',
    type: UserDto,
  })
  blocked: UserDto;
}

export class FriendRequestsResponseDto extends ApiResponseDto<FriendshipDto[]> {}

export class PendingFriendRequestsResponseDto extends ApiResponseDto<FriendshipDto[]> {}

export class UserFriendsResponseDto extends ApiResponseDto<FriendshipDto[]> {}

export class BlockedUsersResponseDto extends ApiResponseDto<BlockDto[]> {}
