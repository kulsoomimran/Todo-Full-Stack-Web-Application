# API Contract: Frontend-Backend Integration

**Date**: 2026-01-09
**Feature**: Frontend & Integration
**Scope**: Contract for API communication between Next.js frontend and FastAPI backend

## Frontend API Client Interface

### Required Headers
**Authorization Token**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Content Type** (for POST/PUT):
```
Content-Type: application/json
```

### Authentication Endpoints (Delegated to Better Auth)
The frontend will use Better Auth's client SDK for authentication flows. JWT tokens will be stored in httpOnly cookies and automatically included in API requests.

---

## Task Management Endpoints

### 1. Get User's Todos
**Endpoint**: `GET /api/todos`
**Purpose**: Retrieve all todos for the authenticated user

**Request**:
- Headers: `Authorization: Bearer <JWT_TOKEN>`
- Query Parameters (optional):
  - `completed`: boolean - Filter by completion status

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "title": "Sample task",
    "description": "Sample description",
    "completed": false,
    "user_id": "user-123",
    "created_at": "2026-01-09T10:00:00Z",
    "updated_at": "2026-01-09T10:00:00Z"
  }
]
```

**Error Responses**:
- 401: Unauthorized (invalid/expired token)
- 500: Internal Server Error

---

### 2. Create New Todo
**Endpoint**: `POST /api/todos`
**Purpose**: Create a new todo for the authenticated user

**Request**:
- Headers: `Authorization: Bearer <JWT_TOKEN>`
- Body:
```json
{
  "title": "New task",
  "description": "Task details",
  "completed": false
}
```

**Success Response (201 Created)**:
```json
{
  "id": 2,
  "title": "New task",
  "description": "Task details",
  "completed": false,
  "user_id": "user-123",
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T10:00:00Z"
}
```

**Error Responses**:
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/expired token)
- 500: Internal Server Error

---

### 3. Get Specific Todo
**Endpoint**: `GET /api/todos/{id}`
**Purpose**: Retrieve a specific todo by ID

**Request**:
- Headers: `Authorization: Bearer <JWT_TOKEN>`
- Path Parameter: `id` (integer)

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "title": "Sample task",
  "description": "Sample description",
  "completed": false,
  "user_id": "user-123",
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T10:00:00Z"
}
```

**Error Responses**:
- 401: Unauthorized (invalid/expired token)
- 404: Not Found (todo doesn't exist or doesn't belong to user)
- 500: Internal Server Error

---

### 4. Update Todo
**Endpoint**: `PUT /api/todos/{id}`
**Purpose**: Update an existing todo

**Request**:
- Headers: `Authorization: Bearer <JWT_TOKEN>`
- Path Parameter: `id` (integer)
- Body (partial update):
```json
{
  "title": "Updated task",
  "description": "Updated description",
  "completed": true
}
```

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "title": "Updated task",
  "description": "Updated description",
  "completed": true,
  "user_id": "user-123",
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T10:05:00Z"
}
```

**Error Responses**:
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/expired token)
- 404: Not Found (todo doesn't exist or doesn't belong to user)
- 500: Internal Server Error

---

### 5. Delete Todo
**Endpoint**: `DELETE /api/todos/{id}`
**Purpose**: Delete a specific todo

**Request**:
- Headers: `Authorization: Bearer <JWT_TOKEN>`
- Path Parameter: `id` (integer)

**Success Response (204 No Content)**:
- No response body

**Error Responses**:
- 401: Unauthorized (invalid/expired token)
- 404: Not Found (todo doesn't exist or doesn't belong to user)
- 500: Internal Server Error

---

## Frontend Error Handling Contract

### Expected Error Response Format
All API errors should follow this format:
```json
{
  "detail": "Error message",
  "status_code": 401
}
```

### Frontend Error Handling Strategy
1. **401 Unauthorized**: Redirect to login page
2. **404 Not Found**: Display user-friendly "item not found" message
3. **400 Bad Request**: Display validation error messages
4. **500 Server Error**: Display generic error message and log details

---

## Frontend Loading States Contract

### Loading Indicators
- **Page-level loading**: Display spinner during initial page load
- **Component-level loading**: Display skeleton or spinner during API calls
- **Action-level loading**: Disable buttons during submission

### Empty States
- **No tasks**: Display message "No tasks yet. Create your first task!"
- **No search results**: Display message "No tasks match your search"

---

## Frontend-BFF (Backend for Frontend) Pattern

### Next.js API Routes
The frontend will implement API routes that act as a BFF (Backend for Frontend) layer:
- `/api/todos/*` routes will forward requests to the backend
- JWT tokens will be attached automatically
- Error responses will be normalized for frontend consumption

### BFF Request Flow
1. Frontend component calls Next.js API route
2. Next.js route extracts JWT from cookie
3. Next.js route forwards request to backend with JWT in header
4. Backend processes request and returns response
5. Next.js route returns response to frontend component

---

## Security Considerations

### JWT Token Management
- Tokens stored in httpOnly cookies (not localStorage)
- Tokens automatically attached to API requests
- Proper token expiration handling

### User Data Isolation
- Frontend only displays data belonging to authenticated user
- Backend enforces user scoping for all operations
- 404 responses for unauthorized access (not 403 to prevent enumeration)

---

## Performance Requirements

### Response Time Targets
- Initial page load: < 3 seconds
- API response time: < 500ms (p95)
- UI interaction response: < 100ms

### Caching Strategy
- Todo lists may be cached briefly on frontend
- Individual todo updates invalidate relevant caches
- Authentication status verified on each page load

---

## Compatibility Requirements

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Responsive Design
- Mobile-first approach
- Desktop and tablet layouts
- Touch-friendly controls

---

## Status
**Ready for implementation** - All contracts defined and aligned with backend API specifications.