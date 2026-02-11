# API Contract: Todos CRUD with Authentication

**Date**: 2026-01-09
**Feature**: JWT Authentication & Security
**Base URL**: `/api/v1`
**Authentication**: All endpoints require `Authorization: Bearer <JWT>` header

---

## Overview

All todo endpoints are now **authenticated**. Each endpoint:
1. Requires valid JWT in `Authorization` header (401 if missing/invalid).
2. Filters results/operations by authenticated user id (`sub` claim from JWT).
3. Returns **404** for "not found or not yours" (prevents existence leakage).

---

## Endpoints

### 1) Create Todo

**POST** `/api/v1/todos`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Buy milk",
  "description": "2L whole milk",
  "completed": false
}
```

**Note**: `user_id` is **not** accepted in request body. Backend assigns it from JWT `sub`.

**Success Response**:
```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Buy milk",
  "description": "2L whole milk",
  "completed": false,
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T10:00:00Z"
}
```

**Status**: `201 Created`

**Error Responses**:

| Status | Condition | Example |
|--------|-----------|---------|
| 400 | Validation error (e.g., title too long) | `{"detail": "title must be <=255 chars"}` |
| 401 | Missing/invalid JWT | `{"detail": "Unauthorized"}` |

---

### 2) List Todos (User's Todos Only)

**GET** `/api/v1/todos`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer <JWT>
```

**Query Parameters** (optional):
| Parameter | Type | Description |
|-----------|------|-------------|
| `completed` | boolean | Filter by completion status (`true` or `false`) |
| `limit` | integer | Max results (default: 100) |
| `offset` | integer | Pagination offset (default: 0) |

**Example**:
```
GET /api/v1/todos?completed=false&limit=10&offset=0
```

**Success Response**:
```json
[
  {
    "id": 1,
    "user_id": "user-123",
    "title": "Buy milk",
    "description": "2L whole milk",
    "completed": false,
    "created_at": "2026-01-09T10:00:00Z",
    "updated_at": "2026-01-09T10:00:00Z"
  },
  {
    "id": 2,
    "user_id": "user-123",
    "title": "Call dentist",
    "description": null,
    "completed": false,
    "created_at": "2026-01-09T11:00:00Z",
    "updated_at": "2026-01-09T11:00:00Z"
  }
]
```

**Status**: `200 OK`

**Error Responses**:

| Status | Condition |
|--------|-----------|
| 401 | Missing/invalid JWT |

**Note**: Returns empty list `[]` if no todos match (not an error).

---

### 3) Get Single Todo

**GET** `/api/v1/todos/{id}`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer <JWT>
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Todo id |

**Success Response**:
```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Buy milk",
  "description": "2L whole milk",
  "completed": false,
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T10:00:00Z"
}
```

**Status**: `200 OK`

**Error Responses**:

| Status | Condition |
|--------|-----------|
| 401 | Missing/invalid JWT |
| 404 | Todo not found **or** todo exists but belongs to different user |

**Note**: Returns **404** in both cases (prevents revealing whether todo exists for other users).

---

### 4) Update Todo

**PUT** `/api/v1/todos/{id}`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Todo id |

**Request Body** (all fields optional):
```json
{
  "title": "Buy oat milk",
  "description": "1L oat milk",
  "completed": true
}
```

**Note**: `user_id` is **not** accepted and is **ignored if provided**.

**Success Response**:
```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Buy oat milk",
  "description": "1L oat milk",
  "completed": true,
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T11:30:00Z"
}
```

**Status**: `200 OK`

**Error Responses**:

| Status | Condition | Example |
|--------|-----------|---------|
| 400 | Validation error (e.g., title empty) | `{"detail": "title must be >=1 char"}` |
| 401 | Missing/invalid JWT | `{"detail": "Unauthorized"}` |
| 404 | Todo not found **or** todo belongs to different user | (same message) |

---

### 5) Delete Todo

**DELETE** `/api/v1/todos/{id}`

**Authentication**: Required

**Request Headers**:
```
Authorization: Bearer <JWT>
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Todo id |

**Success Response**:
```
(empty body)
```

**Status**: `204 No Content`

**Error Responses**:

| Status | Condition |
|--------|-----------|
| 401 | Missing/invalid JWT |
| 404 | Todo not found **or** todo belongs to different user |

---

## Data Isolation Guarantee

### User A Cannot Access User B's Todos

**Scenario 1: List**
```
User A calls: GET /api/v1/todos
Authorization: Bearer <token_A>

Response: List of todos where user_id == "user-A"
(user B's todos are NEVER included)
```

**Scenario 2: Get Specific Todo**
```
User A calls: GET /api/v1/todos/999 (assuming 999 belongs to User B)
Authorization: Bearer <token_A>

Response: 404 Not Found
(backend doesn't reveal whether 999 exists)
```

**Scenario 3: Update/Delete**
```
User A calls: PUT /api/v1/todos/999 (assuming 999 belongs to User B)
Authorization: Bearer <token_A>

Response: 404 Not Found
(backend prevents modification)
```

---

## Error Response Format

### Standard Error Response

All errors follow this schema:

```json
{
  "detail": "Human-readable error message",
  "error_code": "ERROR_CODE_ENUM",
  "status_code": 400
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Invalid input (missing field, invalid format, etc.) |
| `INVALID_TOKEN` | 401 | JWT is invalid, expired, or malformed |
| `UNAUTHORIZED` | 401 | Not authenticated (missing Authorization header) |
| `FORBIDDEN` | 403 | Authenticated but not permitted (reserved for future RBAC) |
| `TODO_NOT_FOUND` | 404 | Todo doesn't exist or doesn't belong to user |
| `INTERNAL_SERVER_ERROR` | 500 | Server error (logged; user sees generic message) |

---

## Summary

| Endpoint | Auth | Filters by user_id? | Error for "not yours" |
|----------|------|--------------------|-----------------------|
| POST /todos | Required | N/A (creates) | N/A |
| GET /todos | Required | YES | N/A (returns empty list if none) |
| GET /todos/{id} | Required | YES | 404 |
| PUT /todos/{id} | Required | YES | 404 |
| DELETE /todos/{id} | Required | YES | 404 |

---

**Status**: Ready for implementation (Phase 2)
