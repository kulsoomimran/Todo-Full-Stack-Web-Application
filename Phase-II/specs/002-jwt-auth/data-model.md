# Data Model: JWT Authentication & User-Scoped Todos

**Date**: 2026-01-09
**Feature**: JWT Authentication & Security
**Phase**: 1 (Design)

## Entities & Ownership

### 1) User (Managed by Better Auth)

**Entity Name**: `auth_user`
**Managed By**: Better Auth SDK (Neon PostgreSQL)
**Backend Access**: Opaque identifier (read from JWT `sub` claim only)

**Attributes** (created by Better Auth):
- `id` (UUID or string): Primary key, stable across sessions
- `email` (string, unique): User email
- `name` (string, optional): User display name
- `password_hash` (string): Hashed password (never exposed)
- `created_at` (timestamp): Account creation time

**Backend Interaction**:
- FastAPI **never queries** the user table directly (stateless constraint).
- User identity derived solely from JWT `sub` claim.
- Password validation happens in Better Auth (frontend responsibility).

**Security Notes**:
- No user table queries in backend (remains stateless).
- User id (`sub`) is always trusted from verified JWT.
- No need to validate user existence on every request (performance).

---

### 2) Todo (Existing, Modified for Auth)

**Entity Name**: `todos`
**Location**: Neon PostgreSQL
**Ownership**: Every todo belongs to exactly one user (immutable).

**Attributes**:
| Attribute | Type | Constraints | Notes |
|-----------|------|------------|-------|
| `id` | INTEGER | Primary key, auto-increment | Stable identifier |
| `user_id` | STRING (255) | NOT NULL, Foreign Key (implicit to user) | Authoritative ownership field |
| `title` | STRING (255) | NOT NULL, min_length=1 | What to do |
| `description` | STRING (1000) | NULL | Optional details |
| `completed` | BOOLEAN | NOT NULL, default=False | Completion status |
| `created_at` | TIMESTAMP | NOT NULL, default=now() | When created |
| `updated_at` | TIMESTAMP | NOT NULL, default=now() | Last modified |

**Ownership Rules**:
- **Immutable**: `user_id` is set at creation time from JWT `sub` and **never** changes.
- **Server-Assigned**: Never accepted from client request body.
- **Authoritative**: All queries filter by `user_id` to enforce isolation.

**Access Rules** (enforced by backend):
- **Create**: Only authenticated user; `user_id` always set to `sub` from JWT.
- **Read**: Only owner can fetch their todos (any attempt to read others' todos → 404).
- **Update**: Only owner can modify (any attempt to update others' todos → 404).
- **Delete**: Only owner can delete (any attempt to delete others' todos → 404).

**Database Indexes** (for performance):
- `CREATE INDEX idx_todos_user_id ON todos(user_id);` — Fast filtering by user.
- `CREATE UNIQUE INDEX idx_todos_user_id_id ON todos(user_id, id);` — Fast ownership lookup.

---

## Schema Evolution & Considerations

### Current Schema (Spec-1)
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(1000),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Planned Changes
**No schema changes needed** for Spec-2. `user_id` field already exists and is used for scoping.

**What changes**:
- Backend now **enforces** `user_id` from JWT (no more mocking).
- Client request schemas **no longer accept** `user_id` input.
- Response schemas **may exclude** `user_id` to reduce data exposure (optional).

---

## Request/Response Contract Adjustments

### API Request Schemas (Updated)

**Before** (Spec-1, insecure):
```json
{
  "title": "Buy milk",
  "description": "2L",
  "completed": false,
  "user_id": "user-123"  // <- Client should NOT send this
}
```

**After** (Spec-2, secure):
```json
{
  "title": "Buy milk",
  "description": "2L",
  "completed": false
  // user_id is server-assigned from JWT
}
```

### API Response Schemas (Updated)

**Todo Response** (includes user_id for client reference):
```json
{
  "id": 1,
  "user_id": "user-123",
  "title": "Buy milk",
  "description": "2L",
  "completed": false,
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T10:00:00Z"
}
```

**Error Response** (Ownership violation):
```json
{
  "error": "Not Found",
  "code": "TODO_NOT_FOUND",
  "message": "Todo not found or access denied",
  "status_code": 404
}
```

---

## Multi-User Isolation (Data Privacy)

### Query Patterns

**List User's Todos**:
```python
# Extract user_id from JWT
user_id = current_user.id

# Only fetch this user's todos
todos = db.query(Todo).filter(Todo.user_id == user_id).all()
```

**Get Single Todo** (with ownership check):
```python
user_id = current_user.id
todo_id = request.params["id"]

todo = db.query(Todo).filter(
  (Todo.id == todo_id) & (Todo.user_id == user_id)
).first()

if not todo:
  return 404("Not Found")  # Hides both "not found" and "not yours"
```

**Update Todo** (with ownership check):
```python
user_id = current_user.id
todo_id = request.params["id"]

todo = db.query(Todo).filter(
  (Todo.id == todo_id) & (Todo.user_id == user_id)
).first()

if not todo:
  return 404("Not Found")

todo.title = request.body["title"]
db.commit()
```

### Security Properties

- **No data leakage**: User A cannot determine if User B's todo id exists.
- **No cross-user access**: Even with a compromised token, queries filter by `user_id`.
- **Deterministic error**: "Not found" and "not yours" both return 404 (same response).

---

## Better Auth Schema Integration

### Better Auth Tables (Auto-Created)

Better Auth creates these tables automatically in Neon PostgreSQL:
- `auth_user`: User accounts
- `auth_session`: Active sessions (linked to cookies/tokens)
- `auth_account`: External account links (if enabled)
- `auth_verification`: Email verification tokens

**Backend Interaction**: None. FastAPI treats Better Auth schema as opaque; only JWT is validated.

---

## Summary of Changes

| Entity | Change | Why |
|--------|--------|-----|
| User (Better Auth) | NEW table created by Better Auth | Persistent user storage |
| Todo | **No schema change** | `user_id` already present for scoping |
| TodoCreate (request) | Remove `user_id` field | Server assigns from JWT |
| TodoResponse | Keep `user_id` field | Client reference (optional) |
| Backend queries | Enforce `user_id` filter | Prevent cross-user access |
| Error handling | Return 404 for "not yours" | Prevent existence leakage |

---

**Status**: Ready for Phase 1.5 (API Contracts)
