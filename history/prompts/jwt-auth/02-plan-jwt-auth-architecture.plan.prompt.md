---
id: 2
title: Plan JWT Auth & Security Architecture
stage: plan
date: 2026-01-09
surface: agent
model: claude-haiku-4-5-20251001
feature: jwt-auth
branch: 002-jwt-auth
user: system
command: /sp.plan
labels: ["authentication", "security", "architecture", "jwt", "better-auth", "plan"]
links:
  spec: ../../../specs/002-jwt-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-jwt-auth/plan.md
  - specs/002-jwt-auth/research.md
  - specs/002-jwt-auth/data-model.md
  - specs/002-jwt-auth/contracts/auth-context.md
  - specs/002-jwt-auth/contracts/todos-api.md
tests:
  - Constitution Check: PASS (SDD workflow, security-first, deterministic behavior, stack compliance)
  - Phase 0 Research: COMPLETE (JWT payload, storage, Python library, shared secret, BFF pattern)
  - Phase 1 Design: COMPLETE (data model, API contracts)
---

## Prompt

Todo Full-Stack Web App – Spec-2 (Auth & Security)

**Goal:** Implement Better Auth + JWT for secure, stateless authentication and user-scoped authorization.

**Plan:**

1. Setup Better Auth on Next.js for sign-up/sign-in; receive JWT on login.
2. Store JWT securely and attach to all API requests as `Authorization: Bearer <token>`.
3. Configure FastAPI to verify JWT with shared secret, extract user identity, reject unauthorized requests (401).
4. Enforce user-scoped access on all task CRUD APIs from Spec-1.
5. Test end-to-end: sign up/in, JWT issuance, token-based API access, task ownership enforcement.

**Constraints:**
- Fixed: Better Auth + JWT, stateless verification, shared secret, Claude Code only.
- Must integrate cleanly with Spec-1 backend.

**Not in Scope:**
- OAuth providers, refresh tokens, role-based permissions, frontend UI polish, external identity providers.

## Response snapshot

**Architecture Design Complete**

1. **Approved Approach**: Next.js BFF (Backend-for-Frontend) pattern with httpOnly cookies + FastAPI JWT verification.
   - Browser never reads JWT directly (CSRF/XSS protection).
   - Frontend stores JWT in httpOnly cookie; attaches to all FastAPI calls via BFF.
   - Backend verifies HS256 JWT using shared secret; stateless (no session DB).
   - User identity extracted from JWT `sub` claim; enforced on all todo CRUD.

2. **Phase 0 Research Complete**:
   - Better Auth issues HS256 JWT with `sub` (user id) + `exp` claims.
   - Python library: PyJWT for verification.
   - Shared secret: generated locally, stored in `.env`, never committed.
   - Token expiration: 30 minutes (no refresh in MVP).

3. **Phase 1 Design Complete**:
   - **Data Model**: Todo ownership immutable, server-assigned `user_id`, stateless backend.
   - **API Contracts**:
     - `auth-context.md`: Bearer header, JWT validation, 401 errors.
     - `todos-api.md`: All CRUD endpoints authenticated; 404 for "not yours".
   - **Implementation Scope**: 7 files new/modified on backend, 8 files new on frontend, tests for auth + ownership.

4. **Key Decisions**:
   - User id from JWT `sub` (standard).
   - HS256 shared secret (simple, no JWKS).
   - BFF pattern (secure).
   - Ownership returns 404 (prevents existence leakage).
   - No session DB lookups (stateless constraint).

5. **Risks Identified & Mitigated**:
   - Token format mismatch → mitigated via Phase 0 research.
   - User_id accepted from client → mitigated by splitting request/response schemas.
   - Secret exposure → mitigated by `.env` + docs.

## Outcome

- ✅ Impact: Complete architecture and contracts ready for implementation. Frontend/backend approaches aligned. Spec-1 backend integration plan clear.
- 🧪 Tests: Constitution Check PASS; Phase 0/1 research and design COMPLETE.
- 📁 Files: plan.md, research.md, data-model.md, auth-context.md, todos-api.md created/updated in specs/002-jwt-auth/.
- 🔁 Next prompts: `/sp.tasks` to break down Phase 2 (backend) and Phase 3 (frontend) implementation into testable tasks.
- 🧠 Reflection: Plan balances security (stateless, shared secret, ownership scoping) with simplicity (HS256, BFF, no sessions). Ready for independent backend/frontend implementation in parallel.

## Evaluation notes (flywheel)

- Failure modes observed: None—planning was clean and structured.
- Graders run and results (PASS/FAIL): Constitution Check PASS; Phase 0 research PASS; Phase 1 design PASS.
- Prompt variant (if applicable): N/A
- Next experiment: N/A (proceed to task generation)

