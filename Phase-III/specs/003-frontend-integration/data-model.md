# Data Model: Frontend & Integration

**Date**: 2026-01-09
**Feature**: Frontend & Integration
**Phase**: 1 (Design)

## Entities & Frontend State

### 1) User (Frontend State)
**Entity Name**: `UserState`
**Location**: Frontend application state (via React Context or similar state management)

**Attributes**:
| Attribute | Type | Constraints | Notes |
|-----------|------|-------------|-------|
| `id` | STRING | Non-empty | Unique identifier from JWT |
| `email` | STRING | Valid email format | User's email address |
| `name` | STRING | Optional | User's display name |
| `isLoggedIn` | BOOLEAN | Required | Authentication status |

**Frontend Interaction**:
- Retrieved from JWT token stored in httpOnly cookie
- Used for UI personalization
- Determines access to protected routes

**Security Notes**:
- Sensitive data not stored in frontend state
- Authentication status validated via backend

---

### 2) Todo Task (Frontend Representation)
**Entity Name**: `Todo`
**Location**: Frontend state and API responses

**Attributes**:
| Attribute | Type | Constraints | Notes |
|-----------|------|-------------|-------|
| `id` | NUMBER | Positive integer | Stable identifier |
| `title` | STRING | Non-empty, max 255 chars | What to do |
| `description` | STRING | Optional, max 1000 chars | Optional details |
| `completed` | BOOLEAN | Required | Completion status |
| `userId` | STRING | Non-empty | Owner identifier |
| `createdAt` | TIMESTAMP | ISO format | When created |
| `updatedAt` | TIMESTAMP | ISO format | Last modified |

**Frontend Operations**:
- **Create**: Via task creation form, validated before submission
- **Read**: Via API fetch, displayed in task list
- **Update**: Via task editing form, optimistic updates possible
- **Delete**: Via delete button, with confirmation

**Validation Rules**:
- `title` must be 1-255 characters
- `description` max 1000 characters
- `completed` must be boolean
- `userId` must match authenticated user

---

### 3) Application State
**Entity Name**: `AppState`
**Location**: Frontend application state

**Attributes**:
| Attribute | Type | Constraints | Notes |
|-----------|------|-------------|-------|
| `loading` | BOOLEAN | Required | Whether data is loading |
| `error` | STRING | Optional | Error message if any |
| `currentView` | STRING | Enum: 'list', 'create', 'edit' | Current UI view |
| `tasks` | ARRAY[Todo] | Array of Todo objects | Current task list |

**Frontend Operations**:
- **Initialize**: Set loading state to true on app start
- **Update**: Reflect API responses in state
- **Error Handling**: Store error messages for display

---

## Frontend Request/Response Contract Adjustments

### API Request Schemas (Frontend)
**Todo Creation**:
```json
{
  "title": "Buy milk",
  "description": "2L",
  "completed": false
  // userId is server-assigned from JWT, not sent from frontend
}
```

**Todo Update**:
```json
{
  "title": "Buy milk",
  "description": "2L",
  "completed": true
  // userId and other fields not allowed to be updated
}
```

### API Response Schemas (Frontend)
**Todo Response** (received from backend):
```json
{
  "id": 1,
  "title": "Buy milk",
  "description": "2L",
  "completed": false,
  "user_id": "user-123",
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T10:00:00Z"
}
```

**Error Response** (from API):
```json
{
  "detail": "Unauthorized",
  "error_code": "INVALID_TOKEN",
  "message": "Token is invalid or expired"
}
```

## Frontend Component State Management

### Task List Component State
- **Purpose**: Manage display of multiple tasks
- **State**: Array of Todo objects, loading status
- **Operations**: Filter, sort, paginate

### Task Form Component State
- **Purpose**: Manage task creation/editing UI
- **State**: Current form values, validation status
- **Operations**: Reset, validate, submit

### Authentication State Management
- **Purpose**: Track user authentication status
- **State**: isLoggedIn, user info, token validity
- **Operations**: Login, logout, token refresh

---

## Frontend-Backend Integration Points

### API Client Layer
- **Responsibility**: Handle JWT attachment to requests
- **Interface**: Standard fetch API with interceptors
- **Error Handling**: Catch and translate API errors

### Authentication Guard
- **Responsibility**: Protect routes based on auth status
- **Implementation**: Next.js middleware
- **Behavior**: Redirect unauthenticated users to login

### Data Sync Mechanism
- **Responsibility**: Keep frontend state in sync with backend
- **Mechanism**: API calls with optimistic updates
- **Conflict Resolution**: Last-write wins with proper error handling

---

## Summary of Frontend Data Considerations

| Entity | Change | Why |
|--------|--------|-----|
| User | Frontend state representation | Track authentication status |
| Todo | UI state management | Handle CRUD operations and display |
| App State | Centralized state | Manage loading/error/empty states |
| API Requests | JWT token attachment | Secure backend communication |
| Component State | React state hooks | Efficient UI updates |

---

**Status**: Ready for Phase 1.5 (API Contracts)