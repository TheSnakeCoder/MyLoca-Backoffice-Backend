import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

  // Handle default admin logic
  try {
    // Create default admin if no admins exist
    await authService.createDefaultAdmin();
  } catch (error) {
    console.error('Error managing default admin:', error);
  }

  const port = process.env.PORT ?? 38942;
  await app.listen(port, 'localhost');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
