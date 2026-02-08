# Implementation Plan: JWT Authentication & Security

**Branch**: `002-jwt-auth` | **Date**: 2026-01-09 | **Spec**: [specs/002-jwt-auth/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-jwt-auth/spec.md`

## Summary

Implement **Better Auth + JWT** authentication with **stateless backend authorization** and **user-scoped todos**. Frontend (Next.js + BFF) manages JWT via httpOnly cookie; backend (FastAPI) verifies HS256 tokens using shared secret, extracts user id from `sub` claim, enforces user isolation across all todo CRUD operations. Result: secure multi-user todo app with transparent authentication integration.

## Technical Context

**Language/Version**: Python 3.11 (backend), Node.js 18+ (frontend)
**Primary Dependencies**:
- Backend: FastAPI 0.104.1, SQLModel 0.0.16, PyJWT (new), Better Auth SDK (no direct backend dep, handled by frontend)
- Frontend: Next.js 16+, Better Auth client SDK
**Storage**: Neon PostgreSQL (existing) + Better Auth schema (auto-created by SDK)
**Testing**: pytest (backend), Jest/Vitest (frontend, TBD)
**Target Platform**: Web (Linux/macOS server for backend, browser for frontend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: JWT verification <50ms (p95); auth flow <3s (user-perceived)
**Constraints**: Stateless backend verification (no session DB lookups); shared secret in .env; httpOnly cookie for token storage
**Scale/Scope**: Initial MVP: 2 users (for testing), extensible to multi-tenant

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **SDD Workflow**: Spec exists and approved (`specs/002-jwt-auth/spec.md`); this plan follows.
✅ **Security-First**: All endpoints require JWT auth; user isolation enforced by `user_id` scoping in queries; secrets in `.env`.
✅ **Deterministic Behavior**: 401 for missing/invalid token; 404 for not-yours/not-found (indistinguishable).
✅ **Stack Non-Negotiable**: Next.js (frontend) + FastAPI (backend) + SQLModel (ORM) + Neon (DB) + Better Auth (auth).
✅ **Full-Stack Coherence**: API contracts specify auth requirements; frontend/backend integrate via BFF + shared JWT secret.

**Violation checks**: None identified. Scope is bounded; stack is fixed; no external dependencies beyond prescribed stack.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── core/
│   │   ├── auth.py (NEW: JWT verification, CurrentUser dependency)
│   │   └── error_handler.py (modified: ensure 401/404 consistency)
│   ├── api/
│   │   └── todo_router.py (modified: apply auth dependency, remove MOCK_USER_ID)
│   ├── models/
│   │   └── todo_model.py (modified: separate request/response schemas re: user_id)
│   ├── services/
│   │   └── todo_service.py (verify ownership scoping, ensure 404 for "not yours")
│   ├── database/
│   │   └── database.py (no changes expected for auth feature)
│   └── main.py (modified: import auth middleware, apply exception handlers)
└── tests/
    ├── test_auth.py (NEW: JWT verification unit tests)
    └── test_auth_todo_integration.py (NEW: ownership + 401/404 scenarios)

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (dashboard)
│   │   ├── auth/
│   │   │   ├── page.tsx (NEW: signin/signup page)
│   │   │   └── callback/page.tsx (NEW: post-auth redirect)
│   │   └── api/
│   │       └── todos/
│   │           ├── route.ts (NEW: BFF GET/POST todos)
│   │           └── [id]/route.ts (NEW: BFF GET/PUT/DELETE todo by id)
│   ├── components/
│   │   └── TodoList.tsx (modified: use BFF, handle 401 by redirecting to signin)
│   ├── services/
│   │   └── auth.ts (NEW: Better Auth setup, JWT cookie management)
│   ├── lib/
│   │   └── api-client.ts (NEW: fetch wrapper for BFF with cookie handling)
│   └── middleware.ts (NEW: check for valid session; redirect to auth if missing)
└── tests/
    └── e2e/ (TBD: signup, signin, create/list todos as multiple users)
```

**Structure Decision**: Full web app (frontend + backend). Backend adds JWT verification and modifies routes; frontend created new in-repo with Better Auth + BFF pattern. No external session store; tokens via httpOnly cookie.

## Implementation Strategy

### Phase 0: Research (specs/002-jwt-auth/research.md)
- Confirm Better Auth JWT payload shape (`sub` claim, HS256 algorithm).
- Choose Python JWT library (PyJWT recommended for simplicity).
- Document shared secret generation and .env setup.

### Phase 1: Data Model & Contracts
- `data-model.md`: Document Todo entity ownership semantics, user scoping rules.
- `contracts/auth-context.md`: Bearer token header, JWT claims, error codes.
- `contracts/todos-api.md`: Modified CRUD endpoints with auth requirements.
- `quickstart.md`: Running frontend/backend locally and testing auth flow.

### Phase 2: Backend Implementation
- `backend/src/core/auth.py`: JWT verification, `get_current_user()` dependency.
- `backend/src/api/todo_router.py`: Replace `MOCK_USER_ID`; apply auth dependency.
- `backend/src/models/todo_model.py`: Separate request schemas (no user_id).
- Backend tests: JWT validation, ownership enforcement, 401/404 error paths.

### Phase 3: Frontend Implementation
- Create Next.js app with Better Auth integration.
- Implement signup/signin flows; store JWT in httpOnly cookie.
- Create BFF routes (`/api/todos/*`) to proxy FastAPI calls with auth header.
- Add middleware to protect routes; redirect to signin if not authenticated.

### Phase 4: E2E Testing & Verification
- Manual E2E: signup, signin, create todos, list as different users, test 404/401.
- Integration tests: token validation, cross-user isolation.
- Documentation: developer quickstart for running both apps locally.

## Complexity Tracking

No Constitution violations identified. Scope is bounded, stack is fixed.
