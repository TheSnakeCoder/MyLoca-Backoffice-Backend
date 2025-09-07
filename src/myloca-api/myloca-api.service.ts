  import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { HttpService } from '@nestjs/axios';
  import { firstValueFrom } from 'rxjs';
  import { AxiosResponse } from 'axios';

  @Injectable()
  export class MylocaApiService {
  private readonly logger = new Logger(MylocaApiService.name);
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

  // Health Check API
  async getHealthCheck(jwtToken: string) {
    return this.makeRequest('GET', '/health', undefined, jwtToken);
  }

  // User Management APIs
  async getAllUsers(page?: number, limit?: number, jwtToken?: string) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/users${queryString}`, undefined, jwtToken);
  }

  async getAllUserProfiles(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/users/admin/all-profiles${queryString}`, undefined, jwtToken);
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

  async deactivateUser(userId: string, jwtToken?: string) {
    return this.makeRequest('POST', `/users/${userId}/deactivate`, undefined, jwtToken);
  }

  async reactivateUser(userId: string, jwtToken?: string) {
    return this.makeRequest('POST', `/users/${userId}/reactivate`, undefined, jwtToken);
  }

  // Friend Management APIs
  async getAllFriendRequests(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/friends/admin/all-requests${queryString}`, undefined, jwtToken);
  }

  async getAllPendingFriendRequests(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/friends/admin/pending-requests${queryString}`, undefined, jwtToken);
  }

  async getAllUserFriends(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/friends/admin/all-friends${queryString}`, undefined, jwtToken);
  }

  async getAllBlockedUsers(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/friends/admin/blocked-users${queryString}`, undefined, jwtToken);
  }


  // Location Management APIs
  async getAllLocationStatus(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/location/admin/all-status${queryString}`, undefined, jwtToken);
  }

  async getAllUsersLocations(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/location/admin/all-locations${queryString}`, undefined, jwtToken);
  }

  async getUserLocation(userId: string, jwtToken: string) {
    return this.makeRequest('GET', `/location/admin/user/${userId}`, undefined, jwtToken);
  }

  async getAllLocationSettings(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/location/admin/all-settings${queryString}`, undefined, jwtToken);
  }

  async getAllFavoriteLocations(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/location/admin/all-favorites${queryString}`, undefined, jwtToken);
  }

  async getAllLocationHistory(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/location/admin/all-history${queryString}`, undefined, jwtToken);
  }

  async getCacheStatus(jwtToken?: string) {
    return this.makeRequest('GET', '/location/cache/status', undefined, jwtToken);
  }

  async getCacheStats(jwtToken?: string) {
    return this.makeRequest('GET', '/location/cache/stats', undefined, jwtToken);
  }

  // Admin Dashboard APIs
  async getDashboardStats(jwtToken: string) {
    return this.makeRequest('GET', '/admin/dashboard/stats', undefined, jwtToken);
  }

  async getDashboardActivity(jwtToken: string, limit?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/admin/dashboard/activity${queryString}`, undefined, jwtToken);
  }

  async getDashboardUserAnalytics(jwtToken: string, days?: number) {
    const params = new URLSearchParams();
    if (days) params.append('days', days.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/admin/dashboard/analytics/users${queryString}`, undefined, jwtToken);
  }

  async getDashboardLocationAnalytics(jwtToken: string) {
    return this.makeRequest('GET', '/admin/dashboard/analytics/locations', undefined, jwtToken);
  }
}
