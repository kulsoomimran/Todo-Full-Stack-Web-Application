# Tasks: Frontend & Integration

**Input**: Design documents from `/specs/001-frontend-integration/` (spec.md, plan.md, research.md, data-model.md, contracts/)

**Status**: ✅ Ready for implementation

**Summary**:
- **Total Tasks**: 25 core tasks
- **P1 Stories** (Authentication & Core Task Management): 12 tasks
- **P2 Stories** (Enhanced UI & Responsiveness): 6 tasks
- **P3 Stories** (Security & Data Isolation): 4 tasks
- **Polish & Integration**: 3 tasks
- **Parallel Opportunities**: Yes (Setup, Foundational, Story-specific phases)
- **Suggested MVP Scope**: Complete Phases 1-3 (Authentication + Basic Task Management → 12 tasks)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure: `frontend/src/app`, `frontend/src/components`, `frontend/src/services`, `frontend/src/lib`, `frontend/src/providers`, `frontend/public`, `frontend/styles`, `frontend/tests`
- [ ] T002 [P] Initialize Next.js 16+ app with TypeScript, Tailwind CSS in `frontend/`
- [ ] T003 [P] Create package.json with Next.js 16+, React 18+, Tailwind CSS dependencies in `frontend/package.json`
- [ ] T004 Create tsconfig.json and next.config.js in `frontend/`
- [ ] T005 Create tailwind.config.js and setup globals.css in `frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create Next.js middleware in `frontend/src/middleware.ts`: Check for authenticated session, redirect unauthenticated to `/auth`
- [ ] T007 [P] Create Better Auth service in `frontend/src/services/auth-service.ts`: Setup Better Auth client, handle signup/signin/signout, manage httpOnly cookie
- [ ] T008 [P] Create API client in `frontend/src/services/api-client.ts`: Fetch wrapper that automatically attaches JWT from cookie as Bearer header
- [ ] T009 Create Task service in `frontend/src/services/task-service.ts`: API methods for task CRUD operations
- [ ] T010 Create Auth context/provider in `frontend/src/app/providers/auth-provider.tsx`: Manage authentication state

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can sign up, sign in, and sign out via frontend

**Independent Test**: Navigate to app → redirect to auth → enter email/password → sign up → verify account created and token issued → can access protected dashboard

### Implementation for User Story 1 (Frontend)

- [ ] T011 [P] [US1] Create auth layout in `frontend/src/app/(auth)/layout.tsx`: Shared auth page layout
- [ ] T012 [P] [US1] Create signup/signin page in `frontend/src/app/(auth)/page.tsx`: Email/password form, call Better Auth signup/signin, handle errors
- [ ] T013 [US1] Create auth callback page in `frontend/src/app/(auth)/callback/page.tsx`: Handle post-authentication redirect, verify JWT stored in cookie
- [ ] T014 [US1] Create signout functionality in `frontend/src/app/providers/auth-provider.tsx`: Clear session and redirect to auth
- [ ] T015 [US1] Update root layout in `frontend/src/app/layout.tsx`: Wrap app with AuthProvider, set up protected routes

**Checkpoint**: User Story 1 complete — users can authenticate and access protected routes

---

## Phase 4: User Story 2 - Task Management (Priority: P1)

**Goal**: Authenticated users can create, view, update, delete, and complete tasks

**Independent Test**: Sign in → navigate to dashboard → create task → see it in list → mark as complete → delete task → verify operations worked

### Implementation for User Story 2 (Frontend)

- [ ] T016 [P] [US2] Create dashboard layout in `frontend/src/app/dashboard/layout.tsx`: Main app layout with navigation
- [ ] T017 [P] [US2] Create dashboard page in `frontend/src/app/dashboard/page.tsx`: Task list and creation form, display "Welcome, {email}"
- [ ] T018 [US2] Create TaskList component in `frontend/src/components/Task/TaskList.tsx`: Display user's tasks with loading/error states
- [ ] T019 [US2] Create TaskForm component in `frontend/src/components/Task/TaskForm.tsx`: Create and edit task UI
- [ ] T020 [US2] Create TaskItem component in `frontend/src/components/Task/TaskItem.tsx`: Individual task display with completion toggle and delete
- [ ] T021 [US2] Connect Task components to services: Implement CRUD operations using task-service.ts

**Checkpoint**: User Story 2 complete — users can manage their tasks

---

## Phase 5: User Story 3 - Responsive UI & Error Handling (Priority: P2)

**Goal**: Application works correctly across desktop and mobile viewports with graceful handling of loading, error, and empty states

**Independent Test**: View app on mobile → verify responsive layout → simulate slow network → see loading indicators → force error → see error message → have no tasks → see empty state

### Implementation for User Story 3 (Frontend)

- [ ] T022 [P] [US3] Create LoadingSpinner component in `frontend/src/components/UI/LoadingSpinner.tsx`: Reusable loading indicator
- [ ] T023 [P] [US3] Create ErrorMessage component in `frontend/src/components/UI/ErrorMessage.tsx`: Standardized error display
- [ ] T024 [US3] Add responsive design classes: Implement mobile-first approach with Tailwind CSS
- [ ] T025 [US3] Create EmptyState component in `frontend/src/components/UI/EmptyState.tsx`: Display when no tasks exist
- [ ] T026 [US3] Add loading and error states to TaskList: Handle API loading/error states gracefully
- [ ] T027 [US3] Add form validation to TaskForm: Client-side validation with user feedback

**Checkpoint**: User Story 3 complete — responsive UI with proper state handling

---

## Phase 6: User Story 4 - Secure Data Isolation (Priority: P3)

**Goal**: UI displays only the authenticated user's data and prevents access to other users' information

**Independent Test**: Sign in as User A → create tasks → sign out → sign in as User B → verify only User B's tasks shown → attempt to access User A's specific task → verify access denied

### Implementation for User Story 4 (Frontend)

- [ ] T028 [P] [US4] Verify API calls use authenticated user context: Confirm JWT is attached to all requests
- [ ] T029 [P] [US4] Implement user data scoping in TaskList: Only show tasks belonging to current user
- [ ] T030 [US4] Add error handling for unauthorized access: Properly handle 404/401 responses from backend
- [ ] T031 [US4] Create user context verification: Confirm frontend only displays user's own data

**Checkpoint**: User Story 4 complete — secure data isolation enforced

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple stories

- [ ] T032 [P] Add comprehensive error handling in `frontend/src/app/error.tsx`: Global error boundary for the application
- [ ] T033 [P] Create developer quickstart in `frontend/README.md`: Local setup (frontend), test auth flow, create/list tasks
- [ ] T034 Add integration tests in `frontend/tests/e2e/`: Test complete auth and task management flow across multiple users

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Stories 1-2 (P1) can proceed in parallel after Foundational
  - User Stories 3-4 (P2-P3) depend only on Foundational (can run parallel to P1 stories)

### User Story Dependencies

- **US1 (Authentication)**: Depends on Phase 2 only - No dependencies on other stories
- **US2 (Task Management)**: Depends on Phase 2 + US1 (authentication must work first)
- **US3 (Responsive UI)**: Depends on Phase 2 + US1/US2 (requires working auth and task features)
- **US4 (Security)**: Depends on Phase 2 + US1/US2 (requires working auth and task features)

### Within Each User Story

- Frontend pages first → components → service integration
- UI components before API integration
- Basic functionality before advanced features

### Parallel Opportunities

**Setup Phase**: All [P] tasks can run in parallel (T002, T003)

**Foundational Phase**: All [P] tasks can run in parallel (T007, T008, T009, T010)
- Authentication developer: T007 (auth service)
- API developer: T008, T009 (API client and task service)
- State developer: T010 (auth context)

**User Stories (P1)**: After Foundational, can split work:
- UI developer: T011-T015 (auth pages and layout)
- Task developer: T016-T021 (dashboard and task components)

**User Stories (P2-P3)**: Can run in parallel with P1 stories if team capacity:
- UI developer: T022-T027 (responsive UI and states)
- Security developer: T028-T031 (data isolation)

---

## Parallel Example: All User Stories (If Team of 4)

```
Phase 1 (Setup) - 1 person, ~1 hour
  ├─ T001, T002, T003, T004, T005 (some [P])

Phase 2 (Foundation) - 2 people in parallel, ~2-3 hours
  ├─ Frontend dev: T006, T010
  └─ Service dev: T007, T008, T009

Phase 3-4 (US1-2, P1) - 2 people in parallel, ~4-6 hours
  ├─ Auth dev:
  │   ├─ T011, T012, T013, T014, T015
  │   └─ (authentication flow)
  └─ Task dev:
      ├─ T016, T017
      ├─ T018, T019, T020, T021
      └─ (task management)

Phase 5-6 (US3-4, P2-P3) - Happens during P1 or after
  ├─ UI dev: T022, T023, T024, T025, T026, T027
  └─ Security dev: T028, T029, T030, T031

Phase 7 (Polish) - 1 person, ~1 hour
  └─ T032, T033, T034 (Documentation, testing, cleanup)

Total time: ~8-12 hours depending on team size and parallelization
```

---

## Implementation Strategy

### MVP First (User Stories 1-2, Authentication + Task Management)

**Scope**: Frontend authentication and basic task CRUD operations

**Tasks**: Phases 1-2 (Setup + Foundational) + Phases 3-4 (US1-2)

**Result**: Users can sign up, sign in, create, view, update, and delete their tasks

**Time**: ~8-10 hours for 2 developers

**Deployment**: Full task management workflow working; users can manage their own tasks

### Incremental Delivery (Add US3-4)

1. Complete MVP (Phases 1-2-3-4)
2. Add US3 (Responsive UI) → mobile-friendly experience verified
3. Add US4 (Security) → multi-user isolation verified
4. Polish and documentation

### Team Strategy (with multiple developers)

1. **Setup (Phase 1)**: Any 1 developer ~1 hour
2. **Foundational (Phase 2)**:
   - Frontend dev: T006, T010 (~1 hour)
   - Service dev: T007, T008, T009 (~2 hours)
3. **User Stories (Phases 3-6)**:
   - Auth dev works on user stories in order (T011-T015)
   - Task dev works on user stories in order (T016-T021, then T022-T027, then T028-T031)
   - Tests run in parallel where marked [P]
4. **Polish (Phase 7)**: Last developer to finish (~30min)

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
- ✅ Next.js 16+ app initialized
- ✅ TypeScript and Tailwind CSS configured
- ✅ Configuration files created

**After Phase 2 (Foundational)**:
- ✅ Next.js middleware protecting routes
- ✅ Better Auth service initialized
- ✅ API client with JWT handling
- ✅ Task service for CRUD operations
- ✅ Authentication context established

**After Phase 3 (US1, MVP)**:
- ✅ Users can sign up via frontend
- ✅ Users can sign in via frontend
- ✅ Users can sign out and clear session
- ✅ Authenticated routes protected
- ✅ Unauthenticated users redirected to auth

**After Phase 4 (US2, MVP)**:
- ✅ Users can create tasks via dashboard
- ✅ Users can view their tasks
- ✅ Users can update task details
- ✅ Users can mark tasks as complete
- ✅ Users can delete tasks

**After Phase 5 (US3)**:
- ✅ Responsive design works on mobile/desktop
- ✅ Loading states displayed appropriately
- ✅ Error states handled gracefully
- ✅ Empty states displayed when no data
- ✅ Form validation implemented

**After Phase 6 (US4)**:
- ✅ Data isolation verified across users
- ✅ Unauthorized access properly rejected
- ✅ User context properly maintained

**After Phase 7 (Polish)**:
- ✅ Global error handling implemented
- ✅ Developer quickstart documented
- ✅ E2E tests pass across user scenarios

---

**Status**: ✅ **TASKS READY FOR IMPLEMENTATION** — Ready for team execution!