import { DocumentBuilder } from '@nestjs/swagger';

export class SwaggerConfig {
  static createConfig() {
    return new DocumentBuilder()
      .setTitle('MyLoca Admin Backoffice API')
      .setDescription(this.getApiDescription())
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter your JWT token obtained from the MyLoca API authentication endpoints',
          in: 'header',
        },
        'bearer',
      )
      .addTag('Authentication', 'Admin authentication and session management')
      .addTag('Admin Dashboard', 'Dashboard statistics, analytics, and system health monitoring')
      .addTag('Admin Users', 'User management and profile oversight')
      .addTag('Admin Friends', 'Friendship monitoring and social network oversight')
      .addTag('Admin Locations', 'Location monitoring, privacy settings, and coordinate access')
      .addTag('Service Monitor', 'System monitoring, health checks, and automated actions')
      .addTag('Audit', 'System audit logs and security monitoring')
      .addServer(`http://localhost:${process.env.PORT ?? 38942}`, 'Development Server')
      .addServer('https://api.myloca.com', 'Production Server')
      .build();
  }

  private static getApiDescription(): string {
    return `

## 📋 Overview
Comprehensive admin oversight API for the MyLoca live location sharing platform. This API provides secure, authenticated access to platform-wide data and administrative functions.

## 🔐 Authentication & Security
- **JWT Bearer Authentication**: All endpoints require valid JWT tokens
- **Admin Authorization**: Platform admin privileges required
- **Token Source**: Obtain tokens from MyLoca main API auth endpoints
- **Security**: All location data is decrypted for admin oversight

## 📊 Core Features

### Dashboard & Analytics
- **Real-time Statistics**: Live user, friendship, and location metrics
- **Growth Analytics**: User registration and engagement trends
- **Usage Patterns**: Location sharing and privacy preference insights
- **System Monitoring**: Health checks and performance metrics

### User Management
- **User Oversight**: View all registered users with detailed profiles
- **Account Control**: Activate/deactivate user accounts
- **Search & Filter**: Find users by username with pagination
- **Activity Monitoring**: Track user engagement and relationships

### Social Network Oversight
- **Friendship Analysis**: Monitor all friendship states (pending/accepted/rejected)
- **Relationship Tracking**: View complete social network connections
- **Block Management**: Monitor user blocking patterns
- **Social Insights**: Analyze platform social dynamics

### Location Intelligence
- **Coordinate Access**: View all user locations with full precision
- **Privacy Monitoring**: Track location sharing preferences and settings
- **Favorite Places**: Monitor popular and favorite location trends
- **History Tracking**: Access complete location history with filtering
- **Cache Performance**: Monitor Redis and memory cache systems

### Service Monitoring
- **Health Monitoring**: Real-time service health checks and status
- **Performance Metrics**: Response times, uptime, and error rates
- **Automated Actions**: Self-healing capabilities and alerting
- **System Analytics**: Comprehensive infrastructure monitoring

### Audit & Security
- **Activity Logging**: Comprehensive audit trail of all admin actions
- **Security Monitoring**: Track access patterns and security events
- **Compliance**: Detailed logs for regulatory compliance
- **Data Protection**: Monitor data access and privacy controls

## 🚀 Technical Specifications
- **Response Format**: JSON with consistent pagination
- **Rate Limiting**: Configured per endpoint type
- **Error Handling**: Standardized HTTP status codes
- **Data Format**: ISO timestamps, encrypted coordinates (decrypted for admin)
- **Performance**: Hybrid caching with Redis primary/memory fallback
- **Monitoring**: Automated health checks and performance tracking

## 📞 Support & Integration
- **External Dashboard**: Designed for admin dashboard integration
- **Monitoring Tools**: Compatible with platform monitoring systems
- **Analytics**: Suitable for reporting and compliance tools
- **Customer Support**: Access for user support operations

---

**Environment**: ${process.env.NODE_ENV || 'development'} | **Version**: 1.0.0 | **Base URL**: http://localhost:${process.env.PORT ?? 38942}
    `.trim();
  }

  static getSwaggerOptions() {
    return {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        docExpansion: 'none',
        filter: true,
        tryItOutEnabled: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        displayRequestDuration: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
      customSiteTitle: 'MyLoca Admin API Documentation',
      customfavIcon: 'https://nestjs.com/img/logo_text.svg',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      ],
      customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #3b82f6; }
        .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; }
        .swagger-ui .info .description p { margin: 8px 0; }
        .swagger-ui .info .description h2 { color: #1e40af; margin-top: 20px; }
        .swagger-ui .info .description h3 { color: #3730a3; margin-top: 15px; }
      `,
    };
  }
}
