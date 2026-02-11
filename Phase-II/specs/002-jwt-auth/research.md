# Research Findings: JWT Authentication & Better Auth Integration

**Date**: 2026-01-09
**Feature**: JWT Authentication & Security
**Status**: Phase 0 Research Complete

## Research Questions & Decisions

### 1) Better Auth JWT Payload Shape

**Question**: Does Better Auth issue tokens with an `sub` claim containing the user id? Is the algorithm HS256?

**Decision**:
- **JWT Payload Shape**: Better Auth issues JWT tokens containing `sub` (subject = user id), `email`, `exp` (expiration), `iat` (issued at), `iss` (issuer).
- **Algorithm**: Better Auth supports both HS256 (shared secret) and RS256 (public key). For this MVP, we use **HS256** for simplicity (no JWKS endpoint required).
- **Canonical User ID**: Use `sub` claim as the authoritative user identifier for scoping todos.

**Rationale**: HS256 with shared secret is simpler to verify in FastAPI (no external JWKS endpoint) and is suitable for a single-domain app. `sub` is the standard JWT claim for subject/user identity.

**Alternatives Considered**:
- RS256/JWKS: More enterprise, but adds complexity (extra endpoint, public key rotation). Deferred.
- Custom claim (e.g., `userId`): Non-standard; Better Auth defaults to `sub` anyway.

---

### 2) Better Auth Storage (User Persistence)

**Question**: How does Better Auth persist users/sessions in a Next.js app? Does it use Neon PostgreSQL?

**Decision**:
- Better Auth provides **SDKs for multiple database adapters** (PostgreSQL, SQLite, MySQL, etc.).
- For this project, configure Better Auth to use **Neon PostgreSQL** (the same DB as todos backend).
- Better Auth creates its own schema tables (`auth_users`, `auth_sessions`, etc.) automatically on first run.
- Frontend (Next.js) queries Better Auth API to manage sessions; backend (FastAPI) **does not** query Better Auth DB (remains stateless).

**Rationale**: Shared database avoids operational complexity (no separate auth service). Stateless backend means FastAPI only validates JWT signature and extracts `sub`.

**Alternatives Considered**:
- External auth service (Auth0, Firebase): Increases operational burden; not needed for MVP.
- Memory-only sessions: Not persistent across restarts; not production-safe.

---

### 3) Python JWT Library for FastAPI Verification

**Question**: Which Python JWT library should FastAPI use to verify HS256 tokens? What are best practices for verification?

**Decision**:
- **Library**: **PyJWT** (simplest, most widely used).
- **Installation**: Add to `backend/requirements.txt`.
- **Verification Steps**:
  1. Extract `Authorization: Bearer <token>` from request header.
  2. Decode token using PyJWT: `jwt.decode(token, secret_key, algorithms=["HS256"])`.
  3. Validate `exp` claim (automatic in PyJWT if `options={"verify_exp": True}`).
  4. Extract `sub` claim → user_id.
  5. Return `CurrentUser(id=sub, ...)` or raise 401.
- **Error Handling**: Any JWT exception (invalid signature, expired, malformed) → 401 Unauthorized.

**Rationale**: PyJWT is lightweight, well-maintained, and has excellent FastAPI integration via Depends().

**Alternatives Considered**:
- `python-jose`: More feature-rich but heavier; overkill for simple HS256 verification.
- Manual verification: Not recommended (cryptographic edge cases).

---

### 4) Shared Secret Generation & .env Setup

**Question**: How should the shared JWT secret be generated and stored?

**Decision**:
- **Generation**: Use `secrets.token_urlsafe(32)` (or similar) to generate a 32+ byte random secret.
- **Storage**: Store in `backend/.env` as `JWT_SECRET_KEY=<generated-value>`.
- **Frontend Access**: Frontend hardcodes the same secret (or reads it from a trusted config if applicable).
- **Never Commit**: Add `.env` to `.gitignore` to prevent accidental commit.

**Rationale**: Secrets must never be committed. `.env` is the standard practice.

**Setup Steps**:
1. Generate secret locally: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
2. Add to `backend/.env`: `JWT_SECRET_KEY=<pasted-value>`
3. Document in `QUICKSTART.md` how to regenerate if needed.

---

### 5) BFF (Backend-for-Frontend) Integration Pattern

**Question**: How should the Next.js frontend send authenticated requests to FastAPI without exposing the JWT to the browser?

**Decision**:
- **Pattern**: Next.js BFF (Backend-for-Frontend).
- **Flow**:
  1. Browser calls Next.js API route (same origin) → no CORS issues.
  2. Next.js route reads JWT from **httpOnly cookie** (set during signin).
  3. Next.js attaches `Authorization: Bearer <token>` header when calling FastAPI.
  4. FastAPI returns response; Next.js returns sanitized response to browser.
  5. Browser never reads the JWT directly.
- **Benefits**:
  - Token never exposed to browser JavaScript (CSRF/XSS protection).
  - Simple CORS (no credentials header needed).
  - Server-side token refresh possible (if needed later).

**Alternatives Considered**:
- Browser direct to FastAPI: Token readable by JS; higher attack surface.
- Session cookies: Requires server-side session store (violates stateless constraint).

---

### 6) JWT Expiration & Refresh Strategy

**Question**: Should we implement token refresh, or use long-lived tokens?

**Decision**:
- **For MVP**: Use moderate expiration (30min) with **no automatic refresh**.
- **User Experience**: If token expires during active use, user is redirected to signin (acceptable for MVP).
- **Rationale**: Simpler implementation; refresh tokens add complexity (storage, rotation).
- **Future**: Can add refresh tokens in a later phase if needed.

---

## Key Decisions Summary

| Area | Decision | Rationale |
|------|----------|-----------|
| JWT Claims | Use `sub` for user_id | Standard JWT convention |
| JWT Algorithm | HS256 (shared secret) | Simple, no external JWKS needed |
| JWT Storage | httpOnly cookie (BFF pattern) | Secure; browser never reads token |
| Python JWT Library | PyJWT | Lightweight, widely used |
| User Database | Neon PostgreSQL (Better Auth schema) | Shared DB; no auth service overhead |
| Backend Verification | Stateless (signature + exp only) | No session DB lookups |
| Token Expiration | 30 minutes, no auto-refresh | Simplicity for MVP |
| Secret Storage | `.env` file (never commit) | Standard practice |

---

## Implementation Prerequisites

Before implementation begins:

1. **Generate JWT Secret**:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Place result in `backend/.env` as `JWT_SECRET_KEY=...`

2. **Add PyJWT to requirements.txt**:
   ```
   PyJWT==2.8.1
   ```

3. **Ensure Better Auth is available in frontend**:
   - Better Auth library (JavaScript SDK) available in npm.
   - Neon PostgreSQL connection string ready for Better Auth schema setup.

4. **Environment Variables Summary**:
   - Backend: `JWT_SECRET_KEY`, `JWT_ALGORITHM=HS256`, `JWT_EXPIRATION_MINUTES=30`
   - Frontend: Same `JWT_SECRET_KEY` (hardcoded in BFF validation if needed, or from .env.local)

---

## Open Questions (for future phases)

1. Should token expiration be configurable per environment (dev vs prod)?
2. Should we audit/log successful vs failed auth attempts?
3. What happens if JWT secret is leaked? (Manual rotation procedure needed?)

---

**Status**: Ready for Phase 1 (Data Model & Contracts)
