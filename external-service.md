# External API Integration Guide

This guide provides all the necessary information to integrate your external admin service with the MyLoc Backend User Management API.

## Table of Contents
- [Overview](#overview)
- [Authentication Setup](#authentication-setup)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Implementation Example](#implementation-example)
- [Error Handling](#error-handling)
- [Testing](#testing)

## Overview

The MyLoc Backend provides a dedicated User Management API exclusively for external admin services. All endpoints require API key authentication and provide full admin access to user operations.

**Base URL:** `http://51.75.119.35:3003`  
**Authentication:** Bearer Token (Authorization header)  
**Content-Type:** `application/json`

## Authentication Setup

### 1. API Key Configuration

Your external service must include an API key in all requests. The API key should be sent as a Bearer token in the `Authorization` header.

**Required Header:**
```
Authorization: Bearer your-secure-admin-api-key-here
```

> **Note:** The documentation shows both `X-API-Key` and `Authorization: Bearer` formats for compatibility. The current implementation uses `Authorization: Bearer` as the primary authentication method.

### 2. Environment Variables

Set up the following environment variables in your external service:

```bash
# External API Configuration
EXTERNAL_API_BASE_URL=http://51.75.119.35:3003
ADMIN_API_KEY=your-secure-admin-api-key-here

# Optional: Timeout settings
EXTERNAL_API_TIMEOUT=30000
```

**Important:** Make sure the `ADMIN_API_KEY` value matches exactly with the one configured in the MyLoc Backend's `.env` file.

## Environment Configuration

### MyLoc Backend (.env)
```bash
# Add this to your MyLoc Backend .env file
ADMIN_API_KEY=your-secure-admin-api-key-here
```

### External Service (.env)
```bash
# Add these to your external service .env file
EXTERNAL_API_BASE_URL=http://51.75.119.35:3003
ADMIN_API_KEY=your-secure-admin-api-key-here
```

## API Endpoints

### User Management

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/users` | Create new user | Body: CreateUserDto |
| `GET` | `/users` | Get all users | Query: page, limit |
| `GET` | `/users/search` | Search users | Query: q, page, limit |
| `GET` | `/users/:id` | Get user by ID | Param: id |
| `PATCH` | `/users/:id` | Update user | Param: id, Body: UpdateUserDto |
| `DELETE` | `/users/:id` | Delete user | Param: id |
| `POST` | `/users/:id/profile-picture` | Upload profile picture | Param: id, File: profilePicture |

### Request/Response Examples

#### 1. Create User
```bash
POST /users
Content-Type: application/json
Authorization: Bearer your-secure-admin-api-key-here

{
  "email": "user@example.com",
  "username": "newuser",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### 2. Get All Users
```bash
GET /users?page=1&limit=20
Authorization: Bearer your-secure-admin-api-key-here
```

#### 3. Search Users
```bash
GET /users/search?q=john&page=1&limit=10
Authorization: Bearer your-secure-admin-api-key-here
```

#### 4. Update User
```bash
PATCH /users/user-id-here
Content-Type: application/json
Authorization: Bearer your-secure-admin-api-key-here

{
  "firstName": "Jane",
  "lastName": "Smith",
  "isActive": true
}
```

#### 5. Upload Profile Picture
```bash
POST /users/user-id-here/profile-picture
Authorization: Bearer your-secure-admin-api-key-here
Content-Type: multipart/form-data

profilePicture: [file]
```

## Implementation Example

Here's a complete NestJS service implementation for your external service:

### ExternalApiService

```typescript
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EXTERNAL_API_BASE_URL') || 'http://51.75.119.35:3003';
    this.timeout = this.configService.get<number>('EXTERNAL_API_TIMEOUT') || 30000;
    
    const apiKey = this.configService.get<string>('ADMIN_API_KEY');
    if (!apiKey) {
      this.logger.error('ADMIN_API_KEY not configured - API calls will fail');
      throw new Error('ADMIN_API_KEY environment variable is required');
    }
    this.apiKey = apiKey;

    this.logger.log(`External API configured: ${this.baseUrl}`);
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config = {
        headers: { ...this.getHeaders(), ...customHeaders },
        timeout: this.timeout,
        ...(data && { data }),
      };

      this.logger.debug(`Making ${method} request to: ${url}`);

      let response: AxiosResponse<T>;

      switch (method) {
        case 'GET':
          response = await firstValueFrom(this.httpService.get(url, config));
          break;
        case 'POST':
          response = await firstValueFrom(this.httpService.post(url, data, config));
          break;
        case 'PUT':
          response = await firstValueFrom(this.httpService.put(url, data, config));
          break;
        case 'PATCH':
          response = await firstValueFrom(this.httpService.patch(url, data, config));
          break;
        case 'DELETE':
          response = await firstValueFrom(this.httpService.delete(url, config));
          break;
      }

      this.logger.debug(`Request successful: ${method} ${url}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(`External API request failed: ${error.message}`, error.stack);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data || 'External API error';
        
        if (status === 401) {
          throw new HttpException('Invalid API key or unauthorized', HttpStatus.UNAUTHORIZED);
        }
        
        throw new HttpException(message, status);
      }
      
      throw new HttpException(
        'Failed to connect to external API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // ============================================================================
  // USER MANAGEMENT METHODS
  // ============================================================================

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDto): Promise<any> {
    return this.makeRequest('POST', '/users', userData);
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(page?: number, limit?: number): Promise<any> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/users${queryString}`);
  }

  /**
   * Search users by query
   */
  async searchUsers(query: string, page?: number, limit?: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    return this.makeRequest('GET', `/users/search?${params.toString()}`);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<any> {
    return this.makeRequest('GET', `/users/${userId}`);
  }

  /**
   * Update user data
   */
  async updateUser(userId: string, updateData: UpdateUserDto): Promise<any> {
    return this.makeRequest('PATCH', `/users/${userId}`, updateData);
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<any> {
    return this.makeRequest('DELETE', `/users/${userId}`);
  }

  /**
   * Upload profile picture for user
   */
  async uploadUserProfilePicture(userId: string, file: Buffer, filename: string, mimetype: string): Promise<any> {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file)], { type: mimetype });
    formData.append('profilePicture', blob, filename);

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      // Don't set Content-Type, let the browser set it with boundary
    };

    return this.makeRequest('POST', `/users/${userId}/profile-picture`, formData, headers);
  }
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  isActive?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  isActive?: boolean;
}
```

### Module Configuration

```typescript
// external-api.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ExternalApiService } from './external-api.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [ExternalApiService],
  exports: [ExternalApiService],
})
export class ExternalApiModule {}
```

## Error Handling

### Common HTTP Status Codes

| Status | Description | Action |
|--------|-------------|---------|
| `200` | Success | Request completed successfully |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Check request format and required fields |
| `401` | Unauthorized | Verify API key is correct and set |
| `404` | Not Found | Resource doesn't exist |
| `422` | Validation Error | Check data format and validation rules |
| `500` | Server Error | Contact backend team |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Testing

### Test API Connection

```bash
# Test basic connectivity
curl -X GET "http://51.75.119.35:3003/users" \
  -H "Authorization: Bearer your-secure-admin-api-key-here" \
  -H "Content-Type: application/json"
```

### Unit Test Example

```typescript
// external-api.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ExternalApiService } from './external-api.service';

describe('ExternalApiService', () => {
  let service: ExternalApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ExternalApiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                EXTERNAL_API_BASE_URL: 'http://localhost:3003',
                ADMIN_API_KEY: 'test-api-key',
                EXTERNAL_API_TIMEOUT: 30000,
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ExternalApiService>(ExternalApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests as needed
});
```

## Security Best Practices

1. **API Key Security:**
   - Store API keys in environment variables only
   - Never commit API keys to version control
   - Use different API keys for different environments
   - Rotate API keys regularly

2. **Network Security:**
   - Use HTTPS in production
   - Implement request timeouts
   - Add rate limiting on your side if needed

3. **Error Handling:**
   - Don't expose sensitive information in error messages
   - Log errors for debugging but sanitize logs
   - Implement retry logic with exponential backoff

## Support

For issues or questions:
1. Check this documentation first
2. Verify API key configuration
3. Test with curl commands
4. Check server logs for detailed error messages

---

**Last Updated:** $(date)  
**API Version:** v1  
**Backend Repository:** MyLoc-Backend
