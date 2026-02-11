---
description: "Task list for Todo Backend Core & Data Layer implementation"
---

# Tasks: Todo Backend Core & Data Layer

**Input**: Design documents from `/specs/001-todo-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend project structure per implementation plan in backend/
- [X] T002 Initialize Python 3.11 project with FastAPI, SQLModel dependencies in backend/requirements.txt
- [X] T003 [P] Configure linting and formatting tools (black, flake8) in backend/pyproject.toml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Setup database schema and migrations framework using SQLModel in backend/src/database/
- [X] T005 [P] Create base Todo model with SQLModel in backend/src/models/todo_model.py
- [X] T006 [P] Setup database connection and session management in backend/src/database/database.py
- [X] T007 Create main FastAPI application in backend/src/main.py
- [X] T008 Configure error handling and logging infrastructure in backend/src/core/
- [X] T009 Setup environment configuration management with python-dotenv in backend/.env

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Todo Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new todo tasks with title, description, and completion status, storing them in the database with user scoping

**Independent Test**: Can be fully tested by making a POST request to the API with task details and verifying the task is stored and retrievable with the correct user scope.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Contract test for POST /api/v1/todos in backend/tests/contract/test_todo_creation.py
- [ ] T011 [P] [US1] Integration test for create todo user journey in backend/tests/integration/test_todo_creation_flow.py

### Implementation for User Story 1

- [X] T012 [P] [US1] Create Todo model with SQLModel in backend/src/models/todo_model.py (extends from foundational model)
- [X] T013 [P] [US1] Create TodoCreate request schema in backend/src/schemas/todo_schema.py
- [X] T014 [US1] Implement todo creation service in backend/src/services/todo_service.py (depends on T012)
- [X] T015 [US1] Implement POST /api/v1/todos endpoint in backend/src/api/todo_router.py
- [X] T016 [US1] Add validation and error handling for create operations
- [X] T017 [US1] Add logging for todo creation operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Retrieve Todo Tasks (Priority: P1)

**Goal**: Enable users to retrieve their todo tasks, with the system only returning tasks that belong to them

**Independent Test**: Can be fully tested by creating multiple tasks for a user and then making a GET request to retrieve only that user's tasks, ensuring other users' tasks are not returned.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Contract test for GET /api/v1/todos in backend/tests/contract/test_todo_retrieval.py
- [ ] T019 [P] [US2] Contract test for GET /api/v1/todos/{id} in backend/tests/contract/test_specific_todo_retrieval.py

### Implementation for User Story 2

- [X] T020 [P] [US2] Create TodoResponse schema in backend/src/schemas/todo_schema.py
- [X] T021 [US2] Implement todo retrieval service methods in backend/src/services/todo_service.py
- [X] T022 [US2] Implement GET /api/v1/todos endpoint in backend/src/api/todo_router.py
- [X] T023 [US2] Implement GET /api/v1/todos/{id} endpoint in backend/src/api/todo_router.py
- [X] T024 [US2] Add user_id scoping to query methods to ensure data isolation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Todo Task (Priority: P2)

**Goal**: Enable users to update their todo tasks, with the system only allowing them to update tasks that belong to them

**Independent Test**: Can be fully tested by updating a task with a PUT/PATCH request and verifying the changes are persisted correctly and only accessible to the owner.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T025 [P] [US3] Contract test for PUT /api/v1/todos/{id} in backend/tests/contract/test_todo_update.py
- [ ] T026 [P] [US3] Integration test for update todo user journey in backend/tests/integration/test_todo_update_flow.py

### Implementation for User Story 3

- [X] T027 [P] [US3] Create TodoUpdate request schema in backend/src/schemas/todo_schema.py
- [X] T028 [US3] Implement todo update service method in backend/src/services/todo_service.py
- [X] T029 [US3] Implement PUT /api/v1/todos/{id} endpoint in backend/src/api/todo_router.py
- [X] T030 [US3] Add validation to ensure user can only update their own tasks

**Checkpoint**: User Stories 1, 2, and 3 should now be independently functional

---

## Phase 6: User Story 4 - Delete Todo Task (Priority: P2)

**Goal**: Enable users to delete their todo tasks, with the system only allowing them to delete tasks that belong to them

**Independent Test**: Can be fully tested by deleting a task with a DELETE request and verifying it is removed from the database and no longer accessible.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T031 [P] [US4] Contract test for DELETE /api/v1/todos/{id} in backend/tests/contract/test_todo_deletion.py
- [ ] T032 [P] [US4] Integration test for delete todo user journey in backend/tests/integration/test_todo_deletion_flow.py

### Implementation for User Story 4

- [X] T033 [US4] Implement todo deletion service method in backend/src/services/todo_service.py
- [X] T034 [US4] Implement DELETE /api/v1/todos/{id} endpoint in backend/src/api/todo_router.py
- [X] T035 [US4] Add validation to ensure user can only delete their own tasks
- [X] T036 [US4] Add soft-delete capability or proper cleanup procedures

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T037 [P] Documentation updates in backend/README.md
- [X] T038 Code cleanup and refactoring across all modules
- [X] T039 Performance optimization for database queries across all operations
- [X] T040 [P] Additional unit tests in backend/tests/unit/
- [X] T041 Security hardening for user isolation
- [X] T042 Run quickstart.md validation to ensure all functionality works as expected

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May reuse models from US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on models from US1 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Depends on models from US1 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /api/v1/todos in backend/tests/contract/test_todo_creation.py"
Task: "Integration test for create todo user journey in backend/tests/integration/test_todo_creation_flow.py"

# Launch all models for User Story 1 together:
Task: "Create Todo model with SQLModel in backend/src/models/todo_model.py"
Task: "Create TodoCreate request schema in backend/src/schemas/todo_schema.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence