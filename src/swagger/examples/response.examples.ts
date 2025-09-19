// Common response examples for Swagger documentation

export const ResponseExamples = {
  // Authentication Examples
  loginSuccess: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    tokenType: 'Bearer',
    expiresIn: 900,
    admin: {
      id: 'clr123xyz789',
      username: 'admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: '2024-01-20T10:30:00Z'
    }
  },

  // User Examples
  userProfile: {
    id: 'clr123xyz789',
    username: 'john_doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    profilePictureUrl: 'https://example.com/avatar.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    lastLoginAt: '2024-01-20T08:30:00Z'
  },

  userList: {
    data: [
      {
        id: 'clr123xyz789',
        username: 'john_doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true
      },
      {
        id: 'clr456abc123',
        username: 'jane_smith',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: true
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 150,
      totalPages: 8
    }
  },

  // Dashboard Examples
  dashboardStats: {
    users: {
      total: 15420,
      active: 12350,
      new: 245,
      growth: 12.5
    },
    locations: {
      total: 89560,
      active: 3420,
      cached: 1250,
      avgResponseTime: 45
    },
    friendships: {
      total: 45230,
      pending: 1520,
      accepted: 43710,
      blocked: 340
    },
    system: {
      uptime: 2592000,
      status: 'HEALTHY',
      lastCheck: '2024-01-20T10:30:00Z'
    }
  },

  // Service Monitor Examples
  systemHealth: {
    overallStatus: 'HEALTHY',
    services: [
      {
        serviceName: 'PostgreSQL Database',
        serviceType: 'DATABASE',
        status: 'HEALTHY',
        message: 'Database connection successful',
        responseTime: 45,
        lastChecked: '2024-01-20T10:30:00Z',
        uptime: 99.9
      },
      {
        serviceName: 'MyLoca External API',
        serviceType: 'EXTERNAL_API',
        status: 'HEALTHY',
        message: 'External API is responsive',
        responseTime: 120,
        lastChecked: '2024-01-20T10:30:00Z',
        uptime: 98.5
      }
    ],
    totalServices: 3,
    healthyServices: 3,
    degradedServices: 0,
    downServices: 0,
    systemUptime: 86400,
    lastFullCheck: '2024-01-20T10:30:00Z'
  },

  serviceMetrics: [
    {
      serviceName: 'PostgreSQL Database',
      avgResponseTime: 52,
      requestCount: 120,
      errorCount: 2,
      successRate: 98.33,
      memoryUsage: 256,
      cpuUsage: 15.5
    },
    {
      serviceName: 'MyLoca External API',
      avgResponseTime: 135,
      requestCount: 89,
      errorCount: 1,
      successRate: 98.88
    }
  ],

  // Location Examples
  locationData: {
    id: 'clr123xyz789',
    userId: 'clr456abc123',
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: 5.0,
    isLive: true,
    privacyLevel: 'FRIENDS_ONLY',
    updatedAt: '2024-01-20T10:30:00Z',
    user: {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe'
    }
  },

  // Friendship Examples
  friendshipData: {
    id: 'clr123xyz789',
    requesterId: 'clr456abc123',
    receiverId: 'clr789def456',
    status: 'ACCEPTED',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    requester: {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe'
    },
    receiver: {
      username: 'jane_smith',
      firstName: 'Jane',
      lastName: 'Smith'
    }
  },

  // Audit Examples
  auditLog: {
    id: 'clr123xyz789',
    action: 'USER_DEACTIVATED',
    resource: 'User',
    resourceId: 'clr456abc123',
    adminId: 'clr789def456',
    metadata: {
      userEmail: 'user@example.com',
      reason: 'Policy violation'
    },
    timestamp: '2024-01-20T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...'
  },

  // Error Examples
  validationError: {
    statusCode: 422,
    message: [
      'email must be a valid email',
      'password should not be empty',
      'username must be longer than or equal to 3 characters'
    ],
    error: 'Unprocessable Entity'
  },

  notFoundError: {
    statusCode: 404,
    message: 'User not found',
    error: 'Not Found'
  },

  unauthorizedError: {
    statusCode: 401,
    message: 'Unauthorized',
    error: 'Unauthorized'
  },

  forbiddenError: {
    statusCode: 403,
    message: 'Insufficient privileges',
    error: 'Forbidden'
  },

  serverError: {
    statusCode: 500,
    message: 'Internal server error',
    error: 'Internal Server Error'
  },

  // Success Messages
  successMessage: {
    message: 'Operation completed successfully'
  },

  deleteSuccess: {
    message: 'Resource deleted successfully'
  },

  updateSuccess: {
    message: 'Resource updated successfully'
  }
};
