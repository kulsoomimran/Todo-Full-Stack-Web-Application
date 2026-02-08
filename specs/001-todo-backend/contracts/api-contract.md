# API Contract: Todo Backend Core & Data Layer

## Base URL
```
https://api.yourapp.com/api/v1
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```
*Note: Authentication enforcement will be implemented in Spec-2*

## Common Response Format

### Success Response
```json
{
  "data": { /* response payload */ },
  "success": true
}
```

### Error Response
```json
{
  "detail": "Error message",
  "success": false
}
```

## Task Operations

### 1. Create Task
- **Endpoint**: `POST /todos`
- **Description**: Creates a new todo task for the authenticated user

#### Request Body
```json
{
  "title": "Task title (required)",
  "description": "Task description (optional)",
  "completed": false
}
```

#### Request Validation
- `title` is required and must be a non-empty string
- `title` must be less than 255 characters
- `completed` defaults to `false` if not provided

#### Responses
- `201 Created`: Task successfully created
  ```json
  {
    "data": {
      "id": 1,
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "created_at": "2026-01-09T10:00:00Z",
      "updated_at": "2026-01-09T10:00:00Z",
      "user_id": "user-uuid"
    },
    "success": true
  }
  ```
- `400 Bad Request`: Validation error
- `500 Internal Server Error`: Server error

### 2. Get All Tasks
- **Endpoint**: `GET /todos`
- **Description**: Retrieves all tasks for the authenticated user

#### Query Parameters
- `completed` (optional): Filter by completion status (`true` or `false`)
- `limit` (optional): Maximum number of results to return
- `offset` (optional): Number of results to skip (for pagination)

#### Responses
- `200 OK`: Tasks retrieved successfully
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "Task title",
        "description": "Task description",
        "completed": false,
        "created_at": "2026-01-09T10:00:00Z",
        "updated_at": "2026-01-09T10:00:00Z",
        "user_id": "user-uuid"
      }
    ],
    "success": true
  }
  ```
- `500 Internal Server Error`: Server error

### 3. Get Specific Task
- **Endpoint**: `GET /todos/{id}`
- **Description**: Retrieves a specific task by ID

#### Path Parameter
- `id` (integer): Task ID

#### Responses
- `200 OK`: Task retrieved successfully
  ```json
  {
    "data": {
      "id": 1,
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "created_at": "2026-01-09T10:00:00Z",
      "updated_at": "2026-01-09T10:00:00Z",
      "user_id": "user-uuid"
    },
    "success": true
  }
  ```
- `404 Not Found`: Task not found or doesn't belong to user
- `500 Internal Server Error`: Server error

### 4. Update Task
- **Endpoint**: `PUT /todos/{id}`
- **Description**: Updates a specific task by ID

#### Path Parameter
- `id` (integer): Task ID

#### Request Body
```json
{
  "title": "Updated task title (optional)",
  "description": "Updated task description (optional)",
  "completed": true
}
```

#### Request Validation
- At least one field must be provided for update
- `title` must be less than 255 characters if provided

#### Responses
- `200 OK`: Task updated successfully
  ```json
  {
    "data": {
      "id": 1,
      "title": "Updated task title",
      "description": "Updated task description",
      "completed": true,
      "created_at": "2026-01-09T10:00:00Z",
      "updated_at": "2026-01-09T11:00:00Z",
      "user_id": "user-uuid"
    },
    "success": true
  }
  ```
- `400 Bad Request`: Validation error
- `404 Not Found`: Task not found or doesn't belong to user
- `500 Internal Server Error`: Server error

### 5. Delete Task
- **Endpoint**: `DELETE /todos/{id}`
- **Description**: Deletes a specific task by ID

#### Path Parameter
- `id` (integer): Task ID

#### Responses
- `204 No Content`: Task deleted successfully
  ```json
  {
    "data": null,
    "success": true
  }
  ```
- `404 Not Found`: Task not found or doesn't belong to user
- `500 Internal Server Error`: Server error

## Error Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid request body or validation failure |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (deferred to Spec-2) |
| 404 | Not Found | Resource does not exist or doesn't belong to user |
| 500 | Internal Server Error | Unexpected server error |

## Rate Limiting
- Requests are limited to 1000 per hour per user
- Exceeding limits returns 429 Too Many Requests

## Data Formats
- Dates and times use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- All text fields accept UTF-8 encoded strings
- All responses are in JSON format