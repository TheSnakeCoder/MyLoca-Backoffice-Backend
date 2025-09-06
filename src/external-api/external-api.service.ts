  import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { HttpService } from '@nestjs/axios';
  import { firstValueFrom } from 'rxjs';
  import { AxiosResponse } from 'axios';

  @Injectable()
  export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EXTERNAL_API_BASE_URL') || 'http://51.75.119.35:3003';
    this.logger.log('External API service initialized');
  }

  private getHeaders(jwtToken?: string) {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (jwtToken) {
      headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    return headers;
  }

  private async makeRequest<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any, jwtToken?: string): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config = {
        headers: this.getHeaders(jwtToken),
        ...(data && { data }),
      };

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
          case 'DELETE':
            response = await firstValueFrom(this.httpService.delete(url, config));
            break;
        }

        return response.data;
      } catch (error: any) {
        this.logger.error(`External API request failed: ${error.message}`, error.stack);
        
        if (error.response) {
          throw new HttpException(
            error.response.data || 'External API error',
            error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        
        throw new HttpException(
          'Failed to connect to external API',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
    }

  // User Management APIs
  async getAllUsers(page?: number, limit?: number, jwtToken?: string) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/users${queryString}`, undefined, jwtToken);
  }

  async getUserById(userId: string, jwtToken?: string) {
    return this.makeRequest('GET', `/users/${userId}`, undefined, jwtToken);
  }

  async searchUsers(query: string, page?: number, limit?: number, jwtToken?: string) {
    const params = new URLSearchParams();
    params.append('q', query);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    return this.makeRequest('GET', `/users/search?${params.toString()}`, undefined, jwtToken);
  }

  async updateUser(userId: string, updateData: any, jwtToken?: string) {
    return this.makeRequest('PUT', `/users/${userId}`, updateData, jwtToken);
  }

  async deleteUser(userId: string, jwtToken?: string) {
    return this.makeRequest('DELETE', `/users/${userId}`, undefined, jwtToken);
  }

  // Friend Management APIs
  async getUserFriends(userId: string, page?: number, limit?: number, jwtToken?: string) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    // This would require admin access to user's friends - may need special admin endpoints
    return this.makeRequest('GET', `/admin/users/${userId}/friends${queryString}`, undefined, jwtToken);
  }

  async getUserFriendRequests(userId: string, jwtToken?: string) {
    return this.makeRequest('GET', `/admin/users/${userId}/friend-requests`, undefined, jwtToken);
  }

    // Location Management APIs
    async getUserLocation(userId: string) {
      return this.makeRequest('GET', `/admin/location/user/${userId}`);
    }

    async getAllActiveLocations() {
      return this.makeRequest('GET', `/admin/location/active-users`);
    }

    async getUserLocationHistory(userId: string, startDate?: string, endDate?: string, page?: number, limit?: number) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      return this.makeRequest('GET', `/admin/location/user/${userId}/history${queryString}`);
    }

    async getUserFavoriteLocations(userId: string) {
      return this.makeRequest('GET', `/admin/location/user/${userId}/favorites`);
    }

    // Notification Management APIs
    async getUserNotifications(userId: string, page?: number, limit?: number) {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      return this.makeRequest('GET', `/admin/notifications/user/${userId}${queryString}`);
    }

    async getSystemNotifications() {
      return this.makeRequest('GET', `/admin/notifications/system`);
    }

    // System Statistics APIs
    async getSystemStats() {
      return this.makeRequest('GET', `/admin/stats/system`);
    }

    async getUserStats() {
      return this.makeRequest('GET', `/admin/stats/users`);
    }

    async getLocationStats() {
      return this.makeRequest('GET', `/admin/stats/location`);
    }
  }
