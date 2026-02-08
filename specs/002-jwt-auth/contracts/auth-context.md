# API Contract: Authentication Context

**Date**: 2026-01-09
**Feature**: JWT Authentication & Security
**Scope**: Authentication requirements for all protected endpoints

## Authorization Header

### Required on All Protected Endpoints

**Format**:
```
Authorization: Bearer <JWT>
```

**Example**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImVtYWlsIjoiYUBiLmNvbSIsImV4cCI6MTc2MDAwMDAwMH0.signature
```

**When Missing**: Endpoint returns **401 Unauthorized**

---

## JWT Token Structure

### Payload (Claims)

**Required Claims**:

| Claim | Type | Example | Purpose |
|-------|------|---------|---------|
| `sub` | string | `"user-123"` | Canonical user identifier (PRIMARY KEY for user scoping) |
| `exp` | number (epoch) | `1760000000` | Token expiration time (auto-validated by backend) |

**Optional Claims** (informational, not used for auth):
| Claim | Type | Example | Purpose |
|-------|------|---------|---------|
| `email` | string | `"alice@example.com"` | User email (for logging/auditing) |
| `iat` | number (epoch) | `1759999999` | Token issued-at time |
| `iss` | string | `"better-auth"` | Issuer identifier |

### Token Validation (Backend)

FastAPI backend performs these checks on every protected request:

1. **Signature Verification**: Verify HS256 signature using shared secret (`JWT_SECRET_KEY`).
2. **Expiration Check**: Validate `exp` claim (token not expired).
3. **Required Claims**: Ensure `sub` claim is present and is a non-empty string.

**On Validation Failure**: Return **401 Unauthorized** with error details.

---

## Error Responses

### 401 Unauthorized (Authentication Required or Failed)

**Scenarios**:
- Missing `Authorization` header
- Malformed header (not `Bearer <token>`)
- Invalid signature (wrong secret or tampered token)
- Expired token (`exp` timestamp in the past)
- Missing `sub` claim

**Response**:
```json
{
  "detail": "Unauthorized",
  "error_code": "INVALID_TOKEN",
  "message": "Token is invalid or expired"
}
```

**HTTP Status**: `401`

---

### 403 Forbidden (Access Denied)

**Scenarios**:
- Token is valid, but user lacks permission for this resource (e.g., trying to access another user's todo).

**Response**:
```json
{
  "detail": "Forbidden",
  "error_code": "ACCESS_DENIED",
  "message": "You do not have permission to access this resource"
}
```

**HTTP Status**: `403`

**Note**: For user-scoped resources (todos), we recommend returning **404** instead of **403** to avoid revealing resource existence. See `todos-api.md`.

---

## Frontend Responsibilities

### Token Delivery

- Frontend (Next.js BFF) reads JWT from **httpOnly cookie**.
- On each request to FastAPI, BFF attaches `Authorization: Bearer <token>` header.
- Browser **never directly reads or transmits** the token (CSRF/XSS protection).

### Error Handling

- If FastAPI returns **401**, frontend redirects user to **signin page**.
- User must sign in again to obtain a new token.

---

## Backend Implementation

### FastAPI Dependency (`get_current_user()`)

**Location**: `backend/src/core/auth.py`

**Pseudo-code**:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
import jwt

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)) -> CurrentUser:
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return CurrentUser(id=user_id, email=payload.get("email"))
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Protected Route Example

```python
@router.get("/todos")
async def list_todos(current_user: CurrentUser = Depends(get_current_user)) -> List[TodoResponse]:
    # Only fetch todos for current_user.id
    todos = db.query(Todo).filter(Todo.user_id == current_user.id).all()
    return todos
```

---

## Shared Secret Management

**Shared Secret**: Stored in `backend/.env` as `JWT_SECRET_KEY`

**Generation**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Usage**:
- Backend: Verify JWT signature with this secret.
- Frontend: Better Auth uses this secret when issuing tokens.

**Security**:
- Never commit `.env` to git (add to `.gitignore`).
- Rotate secret if compromised (requires signing out all users).

---

## Token Lifecycle

### Issuance (By Better Auth)

1. User signs up / signs in via Better Auth.
2. Better Auth generates JWT with `sub`, `exp`, `email`, etc.
3. JWT is stored in **httpOnly cookie** (frontend responsibility).

### Validation (By FastAPI)

1. Browser sends request to Next.js BFF.
2. BFF reads JWT from cookie.
3. BFF forwards request to FastAPI with `Authorization: Bearer <token>`.
4. FastAPI validates signature, expiration, and claims.
5. FastAPI extracts `user_id` from `sub` and passes it to handler.

### Expiration (Current MVP)

- Token valid for **30 minutes** (configured in `JWT_EXPIRATION_MINUTES`).
- If token expires during user session, BFF redirects to signin (user re-authenticates).
- **Refresh tokens**: Not implemented in MVP (future enhancement).

---

## Summary

| Aspect | Detail |
|--------|--------|
| Header | `Authorization: Bearer <JWT>` |
| Algorithm | HS256 (HMAC-SHA256) |
| Signature Secret | Shared between Frontend (Better Auth) and Backend (FastAPI) |
| Canonical User ID | `sub` claim |
| Validation | Signature + Expiration + Claims on every request |
| Failure Mode | 401 Unauthorized |
| Token Storage | httpOnly cookie (not in localStorage) |

---

**Status**: Ready for implementation (Phase 2)
