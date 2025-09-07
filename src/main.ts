import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for local development
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Get services
  const prismaService = app.get(PrismaService);
  const authService = app.get(AuthService);
  
  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('MyLoca Admin Backoffice API')
    .setDescription(
      `
# MyLoca Admin Backoffice API

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

## 🚀 Technical Specifications
- **Response Format**: JSON with consistent pagination
- **Rate Limiting**: Configured per endpoint type
- **Error Handling**: Standardized HTTP status codes
- **Data Format**: ISO timestamps, encrypted coordinates (decrypted for admin)
- **Performance**: Hybrid caching with Redis primary/memory fallback

## 📞 Support & Integration
- **External Dashboard**: Designed for admin dashboard integration
- **Monitoring Tools**: Compatible with platform monitoring systems
- **Analytics**: Suitable for reporting and compliance tools
- **Customer Support**: Access for user support operations

---

**Environment**: Development | **Version**: 1.0.0 | **Base URL**: http://localhost:${process.env.PORT ?? 38942}
      `
    )
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
    .addTag('Admin Dashboard', 'Dashboard statistics, analytics, and system health monitoring')
    .addTag('Admin Users', 'User management and profile oversight')
    .addTag('Admin Friends', 'Friendship monitoring and social network oversight')
    .addTag('Admin Locations', 'Location monitoring, privacy settings, and coordinate access')
    .addServer(`http://localhost:${process.env.PORT ?? 38942}`, 'Development Server')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AppModule],
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return `${controllerKey}_${methodKey}`;
    },
  });

  // Customize the document
  document.info.contact = {
    name: 'MyLoca Admin API Support',
    email: 'admin@myloca.com',
  };

  document.info.license = {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
  };

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      tryItOutEnabled: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
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
  });

  // Handle default admin logic
  try {
    // Create default admin if no admins exist
    await authService.createDefaultAdmin();
  } catch (error) {
    console.error('Error managing default admin:', error);
  }

  const port = process.env.PORT ?? 38942;
  await app.listen(port, 'localhost');
  console.log(`\n🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  console.log(`📋 API JSON: http://localhost:${port}/api-json`);
}
bootstrap();
