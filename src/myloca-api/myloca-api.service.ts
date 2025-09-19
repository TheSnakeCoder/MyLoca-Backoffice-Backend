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
    this.baseUrl = this.configService.get<string>('EXTERNAL_API_BASE_URL') || 'https://mylocalisation.com';
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

  private wrapWithPagination<T>(data: T[], page: number, limit: number, estimatedTotal?: number): any {
    // For a single page of results, we can only estimate total from current page
    // In a real scenario, you'd need a separate API call to get total count
    const total = estimatedTotal || data.length;
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
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
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    const response = await this.makeRequest('GET', `/users?${params.toString()}`, undefined, jwtToken);
    
    // If external API returns array directly (no pagination metadata), wrap it
    if (Array.isArray(response)) {
      return this.wrapWithPagination(response, currentPage, currentLimit);
    }
    
    // If response already has pagination metadata, return as is
    return response;
  }

  async getAllUserProfiles(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    const response = await this.makeRequest('GET', `/users/admin/all-profiles?${params.toString()}`, undefined, jwtToken);
    
    // If external API returns array directly (no pagination metadata), wrap it
    if (Array.isArray(response)) {
      return this.wrapWithPagination(response, currentPage, currentLimit);
    }
    
    // If response already has pagination metadata, return as is
    return response;
  }

  async getUserById(userId: string, jwtToken?: string) {
    return this.makeRequest('GET', `/users/${userId}`, undefined, jwtToken);
  }

  async searchUsers(query: string, page?: number, limit?: number, jwtToken?: string) {
    const params = new URLSearchParams();
    params.append('q', query);
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    const response = await this.makeRequest('GET', `/users/search?${params.toString()}`, undefined, jwtToken);
    
    // If external API returns array directly (no pagination metadata), wrap it
    if (Array.isArray(response)) {
      return this.wrapWithPagination(response, currentPage, currentLimit);
    }
    
    // If response already has pagination metadata, return as is
    return response;
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
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/friends/admin/all-requests?${params.toString()}`, undefined, jwtToken);
  }

  async getAllPendingFriendRequests(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/friends/admin/pending-requests?${params.toString()}`, undefined, jwtToken);
  }

  async getAllUserFriends(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/friends/admin/all-friends?${params.toString()}`, undefined, jwtToken);
  }

  async getAllBlockedUsers(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/friends/admin/blocked-users?${params.toString()}`, undefined, jwtToken);
  }


  // Location Management APIs
  async getAllLocationStatus(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/location/admin/all-status?${params.toString()}`, undefined, jwtToken);
  }

  async getAllUsersLocations(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/location/admin/all-locations?${params.toString()}`, undefined, jwtToken);
  }

  async getUserLocation(userId: string, jwtToken: string) {
    return this.makeRequest('GET', `/location/admin/user/${userId}`, undefined, jwtToken);
  }

  async getAllLocationSettings(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/location/admin/all-settings?${params.toString()}`, undefined, jwtToken);
  }

  async getAllFavoriteLocations(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    const queryString = `?${params.toString()}`;
    return this.makeRequest('GET', `/location/admin/all-favorites${queryString}`, undefined, jwtToken);
  }

  async getAllLocationHistory(jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/location/admin/all-history?${params.toString()}`, undefined, jwtToken);
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

  // Pro Users Admin APIs
  async getAllProUsers(jwtToken: string, page?: number, limit?: number, tier?: string, isActive?: boolean) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    if (tier) params.append('tier', tier);
    if (isActive !== undefined) params.append('isActive', isActive.toString());
    
    return this.makeRequest('GET', `/admin/pro-users?${params.toString()}`, undefined, jwtToken);
  }

  async getProUserDetails(userId: string, jwtToken: string) {
    return this.makeRequest('GET', `/admin/pro-users/${userId}`, undefined, jwtToken);
  }

  async convertUserToPro(userId: string, profileData: any, jwtToken: string) {
    return this.makeRequest('POST', `/admin/pro-users/convert/${userId}`, profileData, jwtToken);
  }

  async updateProUserProfile(userId: string, profileData: any, jwtToken: string) {
    return this.makeRequest('PUT', `/admin/pro-users/${userId}/profile`, profileData, jwtToken);
  }

  async changeProUserSubscriptionTier(userId: string, tierData: any, force?: boolean, jwtToken?: string) {
    const params = new URLSearchParams();
    if (force !== undefined) params.append('force', force.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('PUT', `/admin/pro-users/${userId}/subscription${queryString}`, tierData, jwtToken);
  }

  async convertProUserToIndividual(userId: string, force?: boolean, jwtToken?: string) {
    const params = new URLSearchParams();
    if (force !== undefined) params.append('force', force.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('DELETE', `/admin/pro-users/${userId}/convert-to-individual${queryString}`, undefined, jwtToken);
  }

  async getProUsersAnalyticsOverview(jwtToken: string, days?: number) {
    const params = new URLSearchParams();
    if (days) params.append('days', days.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/admin/pro-users/analytics/overview${queryString}`, undefined, jwtToken);
  }

  async updateProUserQuotaLimits(userId: string, quotaData: any, jwtToken: string) {
    return this.makeRequest('PUT', `/admin/pro-users/${userId}/quota-limits`, quotaData, jwtToken);
  }

  async getProUserQuotaStatus(userId: string, jwtToken: string) {
    return this.makeRequest('GET', `/admin/pro-users/${userId}/quota-status`, undefined, jwtToken);
  }

  // Networks Admin APIs
  async getAllNetworks(jwtToken: string, page?: number, limit?: number, isPublic?: boolean, ownerId?: string) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    if (isPublic !== undefined) params.append('isPublic', isPublic.toString());
    if (ownerId) params.append('ownerId', ownerId);
    
    return this.makeRequest('GET', `/admin/networks?${params.toString()}`, undefined, jwtToken);
  }

  async getNetworkDetails(networkId: string, jwtToken: string) {
    return this.makeRequest('GET', `/admin/networks/${networkId}`, undefined, jwtToken);
  }

  async updateNetwork(networkId: string, networkData: any, jwtToken: string) {
    return this.makeRequest('PUT', `/admin/networks/${networkId}`, networkData, jwtToken);
  }

  async deleteNetwork(networkId: string, jwtToken: string) {
    return this.makeRequest('DELETE', `/admin/networks/${networkId}`, undefined, jwtToken);
  }

  async getNetworkMembers(networkId: string, jwtToken: string, page?: number, limit?: number) {
    const params = new URLSearchParams();
    // Apply default pagination if no values provided
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    
    params.append('page', currentPage.toString());
    params.append('limit', currentLimit.toString());
    
    return this.makeRequest('GET', `/admin/networks/${networkId}/members?${params.toString()}`, undefined, jwtToken);
  }

  async removeNetworkMember(networkId: string, memberId: string, jwtToken: string) {
    return this.makeRequest('DELETE', `/admin/networks/${networkId}/members/${memberId}`, undefined, jwtToken);
  }

  async getNetworkApplications(networkId: string, jwtToken: string) {
    return this.makeRequest('GET', `/admin/networks/${networkId}/applications`, undefined, jwtToken);
  }

  async manageNetworkApplication(networkId: string, applicationId: string, responseData: any, jwtToken: string) {
    return this.makeRequest('PUT', `/admin/networks/${networkId}/applications/${applicationId}`, responseData, jwtToken);
  }

  async getNetworkAnalyticsOverview(jwtToken: string, days?: number) {
    const params = new URLSearchParams();
    if (days) params.append('days', days.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest('GET', `/admin/networks/analytics/overview${queryString}`, undefined, jwtToken);
  }
}
