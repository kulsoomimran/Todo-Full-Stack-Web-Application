# Tasks: JWT Authentication & Security

**Input**: Design documents from `/specs/002-jwt-auth/` (spec.md, plan.md, research.md, data-model.md, contracts/)
**Status**: ✅ Ready for implementation

**Summary**:
- **Total Tasks**: 32 core tasks
- **P1 Stories** (Backend JWT + Frontend BFF): 20 tasks
- **P2 Stories** (User-Scoped Access + Signout): 8 tasks
- **Polish & Integration**: 4 tasks
- **Parallel Opportunities**: Yes (Setup, Foundational, Story-specific phases)
- **Suggested MVP Scope**: Complete Phases 1-3 (Backend auth + Frontend signin → 20 tasks)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure: `frontend/src/app`, `frontend/src/components`, `frontend/src/services`, `frontend/src/lib`, `frontend/src/middleware.ts` — COMPLETED
- [x] T002 [P] Initialize Next.js 16+ app with TypeScript, Tailwind CSS — COMPLETED
- [x] T003 [P] Add PyJWT to `backend/requirements.txt` (version 2.8.1) — COMPLETED
- [x] T004 [P] Generate JWT shared secret and add to `backend/.env` as `JWT_SECRET_KEY` — COMPLETED
- [x] T005 Update `backend/.env` with JWT config: `JWT_ALGORITHM=HS256`, `JWT_EXPIRATION_MINUTES=30` — COMPLETED

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Implement JWT verification module in `backend/src/core/auth.py`: `get_current_user()` dependency, `CurrentUser` model, HS256 validation — COMPLETED
- [x] T007 [P] Import and register auth module in `backend/src/main.py`: import `get_current_user`, ensure exception handling is applied — COMPLETED
- [x] T008 [P] Refactor `backend/src/models/todo_model.py`: Create separate `TodoCreate` (no user_id), `TodoUpdate`, `TodoResponse` schemas — COMPLETED
- [x] T009 [P] Update `backend/src/services/todo_service.py`: Verify queries filter by `user_id`, ensure "not yours" returns 404 — COMPLETED
- [x] T010 [P] Create Next.js middleware in `frontend/src/middleware.ts`: Check for authenticated session, redirect unauthenticated to `/auth` — COMPLETED
- [x] T011 [P] Create Better Auth service in `frontend/src/services/auth.ts`: Setup Better Auth client, handle signup/signin/signout, manage httpOnly cookie — COMPLETED

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Signs Up (Priority: P1) 🎯 MVP

**Goal**: Users can create accounts with email/password via Better Auth, receive JWT token

**Independent Test**: Navigate to `/auth` → enter email/password → sign up → verify account created and token issued → can access protected pages

### Implementation for User Story 1 (Backend)

- [x] T012 [P] [US1] Modify `backend/src/api/todo_router.py`: Remove `MOCK_USER_ID`, apply `Depends(get_current_user)` to all endpoints — COMPLETED
- [x] T013 [P] [US1] Update todo create handler in `backend/src/api/todo_router.py`: Extract user_id from `current_user`, assign to `user_id` field — COMPLETED
- [x] T014 [US1] Add backend test in `backend/tests/test_auth.py`: Test valid JWT verification, extract user_id from `sub` claim — COMPLETED
- [x] T015 [US1] Add backend test in `backend/tests/test_auth.py`: Test missing Authorization header returns 401 — COMPLETED

### Implementation for User Story 1 (Frontend)

- [x] T016 [P] [US1] Create signup page in `frontend/src/app/auth/page.tsx`: Email/password form, call Better Auth signup, handle errors — COMPLETED
- [x] T017 [P] [US1] Create auth callback page in `frontend/src/app/auth/callback/page.tsx`: Handle post-signup redirect, verify JWT stored in cookie — COMPLETED
- [x] T018 [US1] Update `frontend/src/app/layout.tsx`: Add session provider from Better Auth, wrap app — COMPLETED
- [x] T019 [US1] Create dashboard page in `frontend/src/app/page.tsx`: Display "Welcome, {email}" if authenticated, redirect to signin if not — COMPLETED

**Checkpoint**: User Story 1 complete — users can sign up and access authenticated pages

---

## Phase 4: User Story 2 - User Signs In (Priority: P1)

**Goal**: Users can log in with email/password via Better Auth, receive JWT token, access authenticated pages

**Independent Test**: Sign in with existing email/password → verify JWT issued → can access todos → list shows authenticated user's todos

### Implementation for User Story 2 (Backend)

- [x] T020 [P] [US2] Add backend test in `backend/tests/test_auth.py`: Test expired JWT returns 401 — COMPLETED
- [x] T021 [P] [US2] Add backend test in `backend/tests/test_auth.py`: Test invalid signature returns 401 — COMPLETED

### Implementation for User Story 2 (Frontend)

- [x] T022 [P] [US2] Add signin form to `frontend/src/app/auth/page.tsx`: Email/password input for existing users, call Better Auth signin — COMPLETED
- [x] T023 [US2] Create API client wrapper in `frontend/src/lib/api-client.ts`: Fetch wrapper that automatically attaches JWT from cookie as Bearer header — COMPLETED
- [x] T024 [US2] Add signin error handling in `frontend/src/app/auth/page.tsx`: Display validation errors (invalid email, wrong password) — COMPLETED

**Checkpoint**: User Story 2 complete — users can sign in and authenticate

---

## Phase 5: User Story 3 - API Protects All Routes with JWT (Priority: P1)

**Goal**: FastAPI backend verifies JWT on all protected endpoints, rejects unauthenticated with 401

**Independent Test**: Call `/api/todos` without Authorization header → returns 401. Call with valid JWT → returns 200 with todos list

### Implementation for User Story 3 (Backend)

- [x] T025 [P] [US3] Add backend test in `backend/tests/test_auth_todo_integration.py`: Valid JWT → GET /api/todos returns 200 — COMPLETED
- [x] T026 [P] [US3] Add backend test in `backend/tests/test_auth_todo_integration.py`: No Authorization header → GET /api/todos returns 401 — COMPLETED
- [x] T027 [P] [US3] Add backend test in `backend/tests/test_auth_todo_integration.py`: Malformed JWT → returns 401 — COMPLETED
- [x] T028 [US3] Verify all todo endpoints in `backend/src/api/todo_router.py` have `Depends(get_current_user)` applied — COMPLETED

**Checkpoint**: User Story 3 complete — backend enforces JWT on all todo endpoints

---

## Phase 6: User Story 4 - Frontend Attaches JWT Token (Priority: P1)

**Goal**: Next.js BFF automatically attaches JWT token to all FastAPI API requests

**Independent Test**: After signin, inspect network tab → verify all requests to BFF include Authorization header → verify BFF forwards to FastAPI

### Implementation for User Story 4 (Frontend)

- [x] T029 [P] [US4] Create BFF proxy route `frontend/src/app/api/todos/route.ts`: GET (list todos), POST (create todo) with JWT attachment — COMPLETED
- [x] T030 [P] [US4] Create BFF proxy route `frontend/src/app/api/todos/[id]/route.ts`: GET, PUT, DELETE with JWT attachment — COMPLETED
- [x] T031 [US4] Update TodoList component in `frontend/src/components/TodoList.tsx`: Use BFF routes instead of direct FastAPI calls — COMPLETED
- [x] T032 [US4] Add test: TodoList calls `/api/todos` (BFF), receives list, verifies no 401 errors — COMPLETED

**Checkpoint**: User Story 4 complete — frontend BFF properly attaches JWT to backend calls

---

## Phase 7: User Story 5 - User-Scoped Data Access (Priority: P2)

**Goal**: Backend returns only authenticated user's tasks; User A cannot access User B's tasks

**Independent Test**: Sign in as User A → create task → sign out → sign in as User B → list is empty (doesn't show User A's task). Attempt to fetch User A's task id → returns 404

### Implementation for User Story 5 (Backend)

- [x] T033 [P] [US5] Add backend test in `backend/tests/test_auth_todo_integration.py`: User A's token → can list only User A's todos — COMPLETED
- [x] T034 [P] [US5] Add backend test in `backend/tests/test_auth_todo_integration.py`: User A's token → attempt GET User B's todo id → returns 404 — COMPLETED
- [x] T035 [P] [US5] Add backend test in `backend/tests/test_auth_todo_integration.py`: User A's token → attempt PUT User B's todo id → returns 404 — COMPLETED
- [x] T036 [US5] Verify service layer in `backend/src/services/todo_service.py`: All queries include `& (Todo.user_id == user_id)` filter — COMPLETED

**Checkpoint**: User Story 5 complete — multi-user data isolation enforced

---

## Phase 8: User Story 6 - User Signs Out (Priority: P2)

**Goal**: Signed-in users can sign out; JWT is cleared; subsequent API calls return 401

**Independent Test**: Sign in → click sign out → verify redirected to signin → attempt API call → returns 401

### Implementation for User Story 6 (Frontend)

- [x] T037 [P] [US6] Add signout button to `frontend/src/app/layout.tsx`: Call Better Auth signout, clear cookie, redirect to `/auth` — COMPLETED
- [x] T038 [P] [US6] Update middleware in `frontend/src/middleware.ts`: After signout, verify no valid session, redirect to signin — COMPLETED
- [x] T039 [US6] Add test: Sign in → sign out → attempt BFF call → returns 401 — COMPLETED

**Checkpoint**: User Story 6 complete — signout clears authentication and redirects

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple stories

- [x] T040 [P] Add comprehensive error handling in `backend/src/main.py`: Consistent 401/404/500 responses per auth-context contract — COMPLETED
- [x] T041 [P] Create developer quickstart in `QUICKSTART.md`: Local setup (backend + frontend), test signup/signin, create/list todos — COMPLETED
- [x] T042 [P] Add integration test file `backend/tests/test_end_to_end.py`: Signup → signin → create todo → list as different user → verify isolation — COMPLETED
- [x] T043 Documentation: Add JWT secret generation steps to backend README — COMPLETED

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User Stories 1-4 (P1) can proceed in parallel after Foundational
  - User Stories 5-6 (P2) depend only on Foundational (can run parallel to P1 stories)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Signup)**: Depends on Phase 2 only - No dependencies on other stories
- **US2 (Signin)**: Depends on Phase 2 + US1 (users must exist first) - But independently testable with pre-created test accounts
- **US3 (API Auth)**: Depends on Phase 2 + US1/US2 (users must be created) - Independently testable
- **US4 (Frontend BFF)**: Depends on Phase 2 + US3 (backend must verify JWT) - Independently testable
- **US5 (User Isolation)**: Depends on Phase 2 + US3 + US4 (requires multi-user scenario)
- **US6 (Signout)**: Depends on Phase 2 + US1/US2 (requires authenticated users) - Independently testable

### Within Each User Story

- Backend tests before service/routing changes
- Foundational service layer updates before endpoint modifications
- Frontend page/component implementation before BFF routes
- Integration testing to verify multi-layer cooperation

### Parallel Opportunities

**Setup Phase**: All [P] tasks can run in parallel (T002, T003, T004, T005)

**Foundational Phase**: All [P] tasks can run in parallel (T006-T011)
- Backend developer: T006, T007, T008, T009
- Frontend developer: T010, T011
- Both finish → proceed to user stories

**User Stories (P1)**: After Foundational, can split work:
- Backend developer: T012-T015 (Backend US1-3)
- Frontend developer: T016-T024 (Frontend US1-2)
- Both: T025-T032 (Integration US3-4)

**User Stories (P2)**: Can run in parallel with P1 stories if team capacity:
- Backend developer: T033-T036 (US5 backend)
- Frontend developer: T037-T039 (US6 frontend)

---

## Parallel Example: All User Stories (If Team of 4)

```
Phase 1 (Setup) - 1 person, ~30min
  ├─ T002, T003, T004, T005 (all [P])

Phase 2 (Foundation) - 2 people in parallel, ~1-2 hours
  ├─ Backend: T006, T007, T008, T009
  └─ Frontend: T010, T011

Phase 3-6 (US1-4, P1) - 2 people in parallel, ~4-6 hours
  ├─ Backend Developer:
  │   ├─ T012-T015 (Backend US1-3)
  │   ├─ T025-T028 (Backend tests US3)
  │   └─ T033-T036 (Backend US5)
  └─ Frontend Developer:
      ├─ T016-T024 (Frontend US1-2)
      ├─ T029-T032 (Frontend US4)
      └─ T037-T039 (Frontend US6)

Phase 7-8 (US5-6, P2) - Happens during P1 or after

Phase 9 (Polish) - 1 person, ~1 hour
  └─ T040-T043 (Documentation, testing, cleanup)

Total time: ~6-10 hours depending on team size and parallelization
```

---

## Implementation Strategy

### MVP First (User Stories 1-4, Backend + Frontend Signin)

**Scope**: Backend JWT verification + Frontend signup/signin + BFF

**Tasks**: Phases 1-2 (Setup + Foundational) + Phases 3-6 (US1-4)

**Result**: Users can sign up, sign in, and make authenticated API calls

**Time**: ~6-8 hours for 2 developers

**Deployment**: Full JWT auth working; users can manage their own todos

### Incremental Delivery (Add US5-6)

1. Complete MVP (Phases 1-2-3-4-5-6)
2. Add US5 (User-Scoped Access) → multi-user isolation verified
3. Add US6 (Signout) → complete auth lifecycle
4. Polish and documentation

### Team Strategy (with multiple developers)

1. **Setup (Phase 1)**: Any 1 developer ~30min
2. **Foundational (Phase 2)**:
   - Backend dev: T006-T009 (~1 hour)
   - Frontend dev: T010-T011 (~1 hour)
3. **User Stories (Phases 3-8)**:
   - Backend dev works on backend user stories in order (T012-T036)
   - Frontend dev works on frontend user stories in order (T016-T039)
   - Tests run in parallel where marked [P]
4. **Polish (Phase 9)**: Last developer to finish (~30min)

---

## Notes

- [P] = Different files, no dependencies → can run in parallel
- [Story] = Maps task to specific user story (US1, US2, etc.) for traceability
- Each user story is independently completable and testable
- Foundational phase **MUST** complete before any user story begins
- Tests marked [P] can run in parallel within a story
- After each phase, test independently before moving to next
- Stop at any checkpoint to validate story works
- Avoid: vague tasks, same-file edits in parallel, cross-story hard dependencies

---

## Success Checklist

**After Phase 1 (Setup)**:
- ✅ Project structure created
- ✅ JWT secret generated and stored in `.env`
- ✅ PyJWT added to requirements

**After Phase 2 (Foundational)**:
- ✅ Backend JWT auth module created and integrated
- ✅ Frontend Better Auth service initialized
- ✅ Middleware protects routes
- ✅ Todo schemas separated (request ≠ response)

**After Phase 3-6 (US1-4, MVP)**:
- ✅ Users can sign up via Better Auth
- ✅ Users can sign in via Better Auth
- ✅ Backend rejects unauthenticated requests (401)
- ✅ Frontend BFF attaches JWT to all FastAPI calls
- ✅ Authenticated API calls succeed

**After Phase 7 (US5)**:
- ✅ Multi-user data isolation verified
- ✅ User A cannot access User B's tasks (404)

**After Phase 8 (US6)**:
- ✅ Signout clears JWT and redirects
- ✅ Post-signout API calls return 401

**After Phase 9 (Polish)**:
- ✅ Comprehensive error handling
- ✅ Developer quickstart documented
- ✅ E2E integration tests pass

---

**Status**: ✅ **TASKS READY FOR IMPLEMENTATION** — Ready for team execution!
