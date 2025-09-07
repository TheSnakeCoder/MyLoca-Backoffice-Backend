# Admin Oversight Endpoints Summary

This document outlines all the admin endpoints implemented for the MyLoca backoffice backend service. All endpoints require JWT authentication and admin privileges.

## Important Note
This is primarily a **read-only oversight system** designed for monitoring and administrative oversight purposes. Most endpoints are GET requests only. The only modification operations available are user account deactivation/reactivation for essential user management needs.

## Data Sources
The admin oversight system uses two data sources for maximum security and comprehensive coverage:

### Local Database Queries (Secure)
For admin-specific oversight data that doesn't exist in the main API endpoints, we query the database directly:
- **All user profiles**: Complete user data with relationships
- **All friend requests**: System-wide friendship data  
- **All pending requests**: Comprehensive pending friend requests
- **All user friends**: All confirmed friendships
- **All blocked users**: Block relationships across the system
- **All location status**: Location sharing statistics
- **All users locations**: Location data for all users
- **All location settings**: Privacy and location preferences
- **All favorite locations**: Favorite places across users
- **All location privacy**: Privacy settings overview
- **Location history**: Historical location data
- **System statistics**: Comprehensive database statistics

### External API Calls (For existing endpoints)
For individual user data and operations that exist in the main API:
- **Individual user data**: User details, friends, requests
- **User deactivation/reactivation**: Account management operations
- **Cache status**: Location caching system status

## Base Path
All admin endpoints are prefixed with `/admin-oversight/`

## 1. Health Check & Dashboard
**Controller**: `AdminDashboardController`

### Health Check
- **GET** `/admin-oversight/dashboard/health`
- Returns system health status including external API connectivity

### Dashboard Statistics  
- **GET** `/admin-oversight/dashboard/stats`
- Returns comprehensive system, user, and location statistics

## 2. User Management
**Controller**: `AdminUsersController`

### Get All Users
- **GET** `/admin-oversight/users`
- **Query Parameters**: `page`, `limit`
- Returns paginated list of all users (basic info only)
- **Data Source**: Local Database

### Get All User Profiles
- **GET** `/admin-oversight/users/profiles`
- **Query Parameters**: `page`, `limit`
- Returns detailed user profiles with relationships and statistics
- **Data Source**: Local Database


### Search Users
- **GET** `/admin-oversight/users/search`
- **Query Parameters**: `q` (required), `page`, `limit`
- Search for users by username or ID
- **Data Source**: External API

### Get User Details
- **GET** `/admin-oversight/users/:userId`
- Get detailed information for a specific user

### Get User Friends
- **GET** `/admin-oversight/users/:userId/friends`
- **Query Parameters**: `page`, `limit`
- Get friends list for a specific user

### Get User Friend Requests
- **GET** `/admin-oversight/users/:userId/friend-requests`
- Get friend requests for a specific user

### Deactivate User Account
- **POST** `/admin-oversight/users/:userId/deactivate`
- Safely deactivate a user account (admin operation)
- **Response**: Success message with updated user object

### Reactivate User Account
- **POST** `/admin-oversight/users/:userId/reactivate`
- Reactivate a previously deactivated user account (admin operation)
- **Response**: Success message with updated user object


## 3. Friend Management
**Controller**: `AdminFriendsController`

### Get All Friend Requests
- **GET** `/admin-oversight/friends/requests`
- **Query Parameters**: `page`, `limit`
- Returns all friend requests across the system
- **Data Source**: Local Database

### Get All Pending Friend Requests
- **GET** `/admin-oversight/friends/requests/pending`
- **Query Parameters**: `page`, `limit`
- Returns all pending friend requests
- **Data Source**: Local Database

### Get All User Friends
- **GET** `/admin-oversight/friends`
- **Query Parameters**: `page`, `limit`
- Returns all friendship connections
- **Data Source**: Local Database

### Get All Blocked Users
- **GET** `/admin-oversight/friends/blocked`
- **Query Parameters**: `page`, `limit`
- Returns all blocked user relationships
- **Data Source**: Local Database

## 4. Location Management
**Controller**: `AdminLocationsController`

### Get Active User Locations
- **GET** `/admin-oversight/locations/active-users`
- Returns all users with active location sharing

### Get User Location
- **GET** `/admin-oversight/locations/user/:userId`
- Get current location for a specific user

### Get User Location History
- **GET** `/admin-oversight/locations/user/:userId/history`
- **Query Parameters**: `startDate`, `endDate`, `page`, `limit`
- Get location history for a specific user

### Get User Favorite Locations
- **GET** `/admin-oversight/locations/user/:userId/favorites`
- Get favorite locations for a specific user

### Get All Location Status
- **GET** `/admin-oversight/locations/status/all`
- Get location sharing status for all users

### Get All Users Locations
- **GET** `/admin-oversight/locations/all`
- **Query Parameters**: `page`, `limit`
- Get all user locations across the system

### Get All User Location Settings
- **GET** `/admin-oversight/locations/settings`
- **Query Parameters**: `page`, `limit`
- Get location settings for all users

### Get All Favorite Locations
- **GET** `/admin-oversight/locations/favorites/all`
- **Query Parameters**: `page`, `limit`
- Get all favorite locations across the system

### Get All Location Privacy Settings
- **GET** `/admin-oversight/locations/privacy/all`
- **Query Parameters**: `page`, `limit`
- Get privacy settings for all users

### Get Cache Status
- **GET** `/admin-oversight/locations/cache/status`
- Get location caching system status and health

### Get Cache Statistics
- **GET** `/admin-oversight/locations/cache/stats`
- Get cache performance metrics

### Get Location Statistics
- **GET** `/admin-oversight/locations/stats`
- Get general location statistics

## Authentication & Authorization

All endpoints require:
1. **JWT Authentication**: Valid JWT token in Authorization header
2. **Admin Privileges**: Only admin users can access these endpoints

## Request/Response Format

### Common Query Parameters
- `page`: Page number for pagination (optional)
- `limit`: Number of items per page (optional)

### Authentication Headers
```
Authorization: Bearer <jwt_token>
```

### Response Format
All endpoints return JSON responses with appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## External API Integration

The admin endpoints act as a proxy to the main MyLoca API service running on `http://51.75.119.35:3003`. All requests are forwarded with proper authentication and error handling.

## Logging

All admin actions are logged with the following format:
```
Admin {username} {action_description}
```

This provides an audit trail for all administrative operations.
