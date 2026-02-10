---
id: 4
title: Implement JWT auth dependency
stage: refactor
date: 2026-01-09
surface: agent
model: claude-sonnet-4-5-20250929
feature: jwt-auth
branch: 002-jwt-auth
user: unknown
command: implement jwt auth module + tests
labels: ["fastapi","jwt","auth","testing"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - D:\Kulsoom\Hackathon\HackathonII\II-Full-Stack Todos App\backend\src\core\auth.py
 - D:\Kulsoom\Hackathon\HackathonII\II-Full-Stack Todos App\backend\src\main.py
 - D:\Kulsoom\Hackathon\HackathonII\II-Full-Stack Todos App\backend\requirements.txt
 - D:\Kulsoom\Hackathon\HackathonII\II-Full-Stack Todos App\backend\tests\unit\test_auth.py
 - D:\Kulsoom\Hackathon\HackathonII\II-Full-Stack Todos App\backend\tests\conftest.py
 - D:\Kulsoom\Hackathon\HackathonII\II-Full-Stack Todos App\backend\.env
tests:
 - pytest -q D:\Kulsoom\Hackathon\HackathonII\II-Full-Stack Todos App\backend\tests
---

## Prompt

Implement JWT authentication for FastAPI backend based on these specifications:

**Scope**: Create `backend/src/core/auth.py` module with:
1. `CurrentUser` model: id (str), email (optional str)
2. `get_current_user()` FastAPI dependency:
   - Extract `Authorization: Bearer <token>` from request header
   - Verify HS256 JWT signature using `JWT_SECRET_KEY` from .env
   - Validate token expiration (`exp` claim)
   - Extract `sub` claim as user_id
   - Return CurrentUser or raise HTTPException(401)

**Requirements**:
- Use PyJWT library (already in requirements.txt)
- Algorithm: HS256
- Verify `exp` claim automatically
- On error (invalid sig, expired, missing header): HTTPException(401) with detail="Unauthorized"
- Read JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRATION_MINUTES from .env

**Test the module**:
- Test valid JWT verification
- Test missing Authorization header returns 401
- Test expired token returns 401
- Test invalid signature returns 401

**File**: `backend/src/core/auth.py`

Also update `backend/src/main.py` to:
1. Import the auth module
2. Ensure exception handlers are properly configured
3. Verify FastAPI app is set up for middleware/dependency injection

Reference contracts: See `specs/002-jwt-auth/contracts/auth-context.md` for JWT structure and error codes.

Use the existing error_handler module for consistency.

## Response snapshot

Implemented `backend/src/core/auth.py` providing `CurrentUser` and `get_current_user()` dependency using PyJWT HS256 verification with automatic `exp` validation, and consistent 401 Unauthorized failures. Wired `exception_handlers` in `backend/src/main.py`, added PyJWT to backend requirements, and created unit tests covering valid token, missing header, expired token, and invalid signature. Added test `conftest.py` to ensure imports resolve under pytest.

## Outcome

- ✅ Impact: Backend now has a reusable JWT verification dependency for protecting endpoints.
- 🧪 Tests: 4 auth unit tests pass under pytest.
- 📁 Files: Added auth module + tests; updated app initialization for exception handlers.
- 🔁 Next prompts: Apply `Depends(get_current_user)` to todo routes and replace MOCK_USER_ID.
- 🧠 Reflection: Kept changes minimal and aligned with contract; ensured consistent 401 detail.

## Evaluation notes (flywheel)

- Failure modes observed: Pytest import path issues for `src` package; missing pytest-asyncio plugin.
- Graders run and results (PASS/FAIL): pytest (PASS)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Add pytest-asyncio to dev deps or keep sync tests using asyncio.run.
