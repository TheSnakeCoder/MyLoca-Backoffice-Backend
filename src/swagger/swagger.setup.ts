import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './swagger.config';
import { AppModule } from '../app.module';

export class SwaggerSetup {
  static configure(app: INestApplication): void {
    // Create Swagger configuration
    const config = SwaggerConfig.createConfig();

    // Create Swagger document
    const document = SwaggerModule.createDocument(app, config, {
      include: [AppModule],
      deepScanRoutes: true,
      operationIdFactory: (controllerKey: string, methodKey: string) => {
        return `${controllerKey}_${methodKey}`;
      },
    });

    // Enhance document with additional metadata
    this.enhanceDocument(document);

    // Setup Swagger UI
    const swaggerOptions = SwaggerConfig.getSwaggerOptions();
    
    SwaggerModule.setup('api-docs', app, document, swaggerOptions);

    // Also setup JSON endpoint
    SwaggerModule.setup('api-json', app, document, {
      jsonDocumentUrl: 'api-json',
      yamlDocumentUrl: 'api-yaml',
    });

    console.log(`📚 API Documentation: http://localhost:${process.env.PORT || 38942}/api-docs`);
    console.log(`📋 API JSON: http://localhost:${process.env.PORT || 38942}/api-json`);
    console.log(`📄 API YAML: http://localhost:${process.env.PORT || 38942}/api-yaml`);
  }

  private static enhanceDocument(document: any): void {
    // Add contact information
    document.info.contact = {
      name: 'MyLoca Admin API Support',
      email: 'admin@myloca.com',
      url: 'https://myloca.com/support'
    };

    // Add license information
    document.info.license = {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    };

    // Add external documentation
    document.externalDocs = {
      description: 'MyLoca Platform Documentation',
      url: 'https://docs.myloca.com'
    };

    // Add custom headers for all operations
    if (document.paths) {
      Object.values(document.paths).forEach((path: any) => {
        Object.values(path).forEach((operation: any) => {
          if (operation.parameters) {
            // Add common headers that might be useful
            operation.parameters.push({
              name: 'X-Request-ID',
              in: 'header',
              required: false,
              schema: { type: 'string' },
              description: 'Optional request identifier for tracking'
            });
          }
        });
      });
    }

    // Add security schemes
    if (!document.components) {
      document.components = {};
    }
    
    if (!document.components.securitySchemes) {
      document.components.securitySchemes = {};
    }

    // Add API Key security scheme for future use
    document.components.securitySchemes.ApiKeyAuth = {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key',
      description: 'API Key for external service access'
    };

    // Add common response schemas
    if (!document.components.schemas) {
      document.components.schemas = {};
    }

    // Add common error response schema
    document.components.schemas.ErrorResponse = {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 400 },
        message: { 
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } }
          ]
        },
        error: { type: 'string', example: 'Bad Request' },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/api/users' }
      }
    };

    // Add pagination schema
    document.components.schemas.Pagination = {
      type: 'object',
      properties: {
        page: { type: 'integer', example: 1 },
        limit: { type: 'integer', example: 20 },
        total: { type: 'integer', example: 150 },
        totalPages: { type: 'integer', example: 8 }
      }
    };

    // Add common success response
    document.components.schemas.SuccessMessage = {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Operation completed successfully' }
      }
    };

    // Add metadata about the API
    document.info['x-api-version'] = '1.0.0';
    document.info['x-api-id'] = 'myloca-admin-api';
    document.info['x-audience'] = 'internal';
    
    // Add build information if available
    if (process.env.BUILD_VERSION) {
      document.info['x-build-version'] = process.env.BUILD_VERSION;
    }
    
    if (process.env.BUILD_DATE) {
      document.info['x-build-date'] = process.env.BUILD_DATE;
    }
  }

  static getDocumentationUrls(port: number = parseInt(process.env.PORT || '38942')) {
    return {
      docs: `http://localhost:${port}/api-docs`,
      json: `http://localhost:${port}/api-json`,
      yaml: `http://localhost:${port}/api-yaml`
    };
  }
}
