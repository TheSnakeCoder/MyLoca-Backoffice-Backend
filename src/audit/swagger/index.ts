/**
 * Audit Module Swagger Documentation
 * 
 * This module contains all Swagger/OpenAPI documentation for the audit endpoints.
 * It provides comprehensive API documentation for admin audit logging, monitoring,
 * and compliance features.
 * 
 * @module AuditSwagger
 */

export * from './audit.swagger';

// Re-export DTOs for convenience
export * from '../dto/audit-log-query.dto';
export * from '../dto/audit-response.dto';

/**
 * Swagger Documentation Structure:
 * 
 * 1. Controller Decorators:
 *    - ApiAuditController: Common decorators for all audit endpoints
 *    
 * 2. Endpoint Decorators:
 *    - ApiGetAuditLogs: GET /audit/logs - Retrieve active audit logs
 *    - ApiGetAuditStats: GET /audit/stats - Get audit statistics
 *    - ApiGetAdminActivity: GET /audit/admin/:id/activity - Admin activity summary
 *    - ApiArchiveAuditLogs: GET /audit/archive - Archive old logs
 *    - ApiGetAllAuditLogs: GET /audit/logs/all - All logs including archived
 *    - ApiCleanupAuditLogs: GET /audit/cleanup - Deprecated deletion endpoint
 *    
 * 3. Query Parameter Decorators:
 *    - ApiAuditLogQuery: Common filtering parameters
 *    - ApiStatsQuery: Statistics query parameters
 *    - ApiActivityQuery: Activity query parameters
 *    - ApiArchiveQuery: Archive operation parameters
 *    
 * 4. Response DTOs:
 *    - Comprehensive response schemas with examples
 *    - Proper error response documentation
 *    - Pagination and metadata structures
 *    
 * 5. Security Documentation:
 *    - JWT Bearer authentication requirements
 *    - Admin privilege verification
 *    - Audit trail logging for compliance
 */
