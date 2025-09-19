import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

// Common response decorators for reusability across controllers

export function ApiStandardResponses() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized'
        }
      }
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient admin privileges',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden'
        }
      }
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error'
        }
      }
    })
  );
}

export function ApiPaginatedResponse(dataType: any, description?: string) {
  return ApiResponse({
    status: 200,
    description: description || 'Paginated results retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: `#/components/schemas/${dataType.name}` }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 150 },
            totalPages: { type: 'number', example: 8 }
          }
        }
      }
    }
  });
}

export function ApiHealthResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Health check successful',
      schema: {
        example: {
          status: 'HEALTHY',
          timestamp: '2024-01-20T10:30:00Z',
          uptime: 86400,
          services: {
            database: 'HEALTHY',
            external_api: 'HEALTHY',
            internal_services: 'HEALTHY'
          }
        }
      }
    }),
    ApiResponse({
      status: 503,
      description: 'Service Unavailable - One or more services are down',
      schema: {
        example: {
          status: 'DOWN',
          timestamp: '2024-01-20T10:30:00Z',
          services: {
            database: 'DOWN',
            external_api: 'DEGRADED',
            internal_services: 'HEALTHY'
          }
        }
      }
    })
  );
}

export function ApiCreatedResponse(description?: string) {
  return ApiResponse({
    status: 201,
    description: description || 'Resource created successfully'
  });
}

export function ApiUpdatedResponse(description?: string) {
  return ApiResponse({
    status: 200,
    description: description || 'Resource updated successfully'
  });
}

export function ApiDeletedResponse(description?: string) {
  return ApiResponse({
    status: 200,
    description: description || 'Resource deleted successfully',
    schema: {
      example: {
        message: 'Resource deleted successfully'
      }
    }
  });
}

export function ApiNotFoundResponse(resource?: string) {
  return ApiResponse({
    status: 404,
    description: `${resource || 'Resource'} not found`,
    schema: {
      example: {
        statusCode: 404,
        message: `${resource || 'Resource'} not found`,
        error: 'Not Found'
      }
    }
  });
}

export function ApiBadRequestResponse(description?: string) {
  return ApiResponse({
    status: 400,
    description: description || 'Bad Request - Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['Validation error details'],
        error: 'Bad Request'
      }
    }
  });
}

export function ApiValidationErrorResponse() {
  return ApiResponse({
    status: 422,
    description: 'Validation Error - Invalid data format',
    schema: {
      example: {
        statusCode: 422,
        message: [
          'property should not be empty',
          'property must be a valid email'
        ],
        error: 'Unprocessable Entity'
      }
    }
  });
}
