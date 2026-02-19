# Tasks: MCP Server & Tooling Integration for Todo Operations

**Input**: Design documents from `/specs/001-mcp-todo-tools/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install MCP SDK and create project structure

- [x] T001 Install MCP SDK by adding `mcp>=1.0.0` to backend/requirements.txt
- [x] T002 Install dependencies with `pip install -r backend/requirements.txt`
- [x] T003 Create MCP module structure: backend/src/mcp/__init__.py
- [x] T004 [P] Create tools directory: backend/src/mcp/tools/__init__.py
- [x] T005 [P] Create schemas directory: backend/src/mcp/schemas/__init__.py
- [x] T006 [P] Create validators directory: backend/src/mcp/validators/__init__.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schemas, validators, and error handling that ALL tools depend on

**⚠️ CRITICAL**: No tool implementation can begin until this phase is complete

- [x] T007 [P] Define error codes enum in backend/src/mcp/schemas/error_schemas.py
- [x] T008 [P] Define ErrorResponse schema in backend/src/mcp/schemas/error_schemas.py
- [x] T009 [P] Define TaskOutput schema in backend/src/mcp/schemas/tool_schemas.py
- [x] T010 [P] Define TaskListOutput schema in backend/src/mcp/schemas/tool_schemas.py
- [x] T011 [P] Define DeleteTaskOutput schema in backend/src/mcp/schemas/tool_schemas.py
- [x] T012 Implement validate_user_id function in backend/src/mcp/validators/auth_validator.py
- [x] T013 Implement error mapping utility in backend/src/mcp/schemas/error_schemas.py

**Checkpoint**: Foundation ready - tool implementation can now begin in parallel

---

## Phase 3: User Story 1 - Tool Registration and Discovery (Priority: P1) 🎯 MVP

**Goal**: MCP server running with all 5 tools registered and discoverable

**Independent Test**: Query MCP server for available tools and verify all 5 tools are registered with complete schemas

### Implementation for User Story 1

- [x] T014 [US1] Initialize MCP server in backend/src/mcp/server.py
- [x] T015 [US1] Create tool registration framework in backend/src/mcp/server.py
- [x] T016 [US1] Add server lifecycle management (startup/shutdown) in backend/src/mcp/server.py
- [x] T017 [US1] Implement tool discovery endpoint in backend/src/mcp/server.py

**Checkpoint**: MCP server can start and list tools (even if tool implementations are stubs)

---

## Phase 4: User Story 2 - Secure Task Creation (Priority: P1)

**Goal**: add_task tool creates tasks with user_id validation and database persistence

**Independent Test**: Invoke add_task with valid user_id and verify task appears in database

### Implementation for User Story 2

- [x] T018 [P] [US2] Define AddTaskInput schema in backend/src/mcp/schemas/tool_schemas.py
- [x] T019 [US2] Implement add_task tool in backend/src/mcp/tools/add_task.py
- [x] T020 [US2] Integrate add_task with TodoService.create_todo in backend/src/mcp/tools/add_task.py
- [x] T021 [US2] Add input validation and error handling in backend/src/mcp/tools/add_task.py
- [x] T022 [US2] Register add_task tool in backend/src/mcp/server.py

**Checkpoint**: add_task tool fully functional and independently testable

---

## Phase 5: User Story 3 - User-Scoped Task Retrieval (Priority: P1)

**Goal**: list_tasks tool retrieves all tasks for a user with ownership enforcement

**Independent Test**: Create tasks for multiple users, invoke list_tasks with specific user_id, verify only that user's tasks returned

### Implementation for User Story 3

- [x] T023 [P] [US3] Define ListTasksInput schema in backend/src/mcp/schemas/tool_schemas.py
- [x] T024 [US3] Implement list_tasks tool in backend/src/mcp/tools/list_tasks.py
- [x] T025 [US3] Integrate list_tasks with TodoService.get_todos_by_user in backend/src/mcp/tools/list_tasks.py
- [x] T026 [US3] Add user_id validation and error handling in backend/src/mcp/tools/list_tasks.py
- [x] T027 [US3] Register list_tasks tool in backend/src/mcp/server.py

**Checkpoint**: list_tasks tool fully functional and independently testable

---

## Phase 6: User Story 4 - Task Status Updates (Priority: P2)

**Goal**: update_task and complete_task tools modify tasks with ownership validation

**Independent Test**: Create task, invoke update_task and complete_task, verify changes persist and ownership is enforced

### Implementation for User Story 4

- [x] T028 [P] [US4] Define UpdateTaskInput schema in backend/src/mcp/schemas/tool_schemas.py
- [x] T029 [P] [US4] Define CompleteTaskInput schema in backend/src/mcp/schemas/tool_schemas.py
- [x] T030 [US4] Implement update_task tool in backend/src/mcp/tools/update_task.py
- [x] T031 [US4] Integrate update_task with TodoService.update_todo in backend/src/mcp/tools/update_task.py
- [x] T032 [US4] Add ownership validation and error handling in backend/src/mcp/tools/update_task.py
- [x] T033 [US4] Implement complete_task tool in backend/src/mcp/tools/complete_task.py
- [x] T034 [US4] Integrate complete_task with TodoService.update_todo in backend/src/mcp/tools/complete_task.py
- [x] T035 [US4] Add ownership validation and error handling in backend/src/mcp/tools/complete_task.py
- [x] T036 [US4] Register update_task tool in backend/src/mcp/server.py
- [x] T037 [US4] Register complete_task tool in backend/src/mcp/server.py

**Checkpoint**: update_task and complete_task tools fully functional and independently testable

---

## Phase 7: User Story 5 - Task Deletion (Priority: P3)

**Goal**: delete_task tool permanently removes tasks with ownership validation

**Independent Test**: Create task, invoke delete_task, verify task no longer exists in database or list_tasks results

### Implementation for User Story 5

- [x] T038 [P] [US5] Define DeleteTaskInput schema in backend/src/mcp/schemas/tool_schemas.py
- [x] T039 [US5] Implement delete_task tool in backend/src/mcp/tools/delete_task.py
- [x] T040 [US5] Integrate delete_task with TodoService.delete_todo in backend/src/mcp/tools/delete_task.py
- [x] T041 [US5] Add ownership validation and error handling in backend/src/mcp/tools/delete_task.py
- [x] T042 [US5] Register delete_task tool in backend/src/mcp/server.py

**Checkpoint**: delete_task tool fully functional and independently testable

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple tools

- [x] T043 [P] Add comprehensive logging for all tool invocations in backend/src/mcp/server.py
- [x] T044 [P] Add database connection error handling across all tools
- [x] T045 [P] Verify all error responses follow standardized format
- [x] T046 [P] Add tool invocation metrics (count, latency) in backend/src/mcp/server.py
- [x] T047 Validate all tools against quickstart.md examples
- [x] T048 Update backend/requirements.txt with final dependency versions
- [x] T049 Create MCP server startup script or integration with main.py

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (Phase 3): Tool registration framework - BLOCKS tool implementations
  - US2 (Phase 4): Can start after US1 completion
  - US3 (Phase 5): Can start after US1 completion (parallel with US2)
  - US4 (Phase 6): Can start after US1 completion (parallel with US2/US3)
  - US5 (Phase 7): Can start after US1 completion (parallel with US2/US3/US4)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational - BLOCKS all tool implementations
- **User Story 2 (P1)**: Depends on US1 - Can run parallel with US3/US4/US5
- **User Story 3 (P1)**: Depends on US1 - Can run parallel with US2/US4/US5
- **User Story 4 (P2)**: Depends on US1 - Can run parallel with US2/US3/US5
- **User Story 5 (P3)**: Depends on US1 - Can run parallel with US2/US3/US4

### Within Each User Story

- Schemas before tool implementation
- Tool implementation before registration
- All tools can be implemented in parallel after US1 completes

### Parallel Opportunities

- All Setup tasks (T004-T006) can run in parallel
- All Foundational schema tasks (T007-T011) can run in parallel
- After US1 completes, all tool implementations (US2-US5) can run in parallel
- Within US4, both update_task and complete_task can be developed in parallel
- All Polish tasks (T043-T046) can run in parallel

---

## Parallel Example: After US1 Completion

```bash
# Launch all tool implementations together:
Task: "Implement add_task tool in backend/src/mcp/tools/add_task.py"
Task: "Implement list_tasks tool in backend/src/mcp/tools/list_tasks.py"
Task: "Implement update_task tool in backend/src/mcp/tools/update_task.py"
Task: "Implement complete_task tool in backend/src/mcp/tools/complete_task.py"
Task: "Implement delete_task tool in backend/src/mcp/tools/delete_task.py"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Tool Registration)
4. Complete Phase 4: User Story 2 (add_task)
5. Complete Phase 5: User Story 3 (list_tasks)
6. **STOP and VALIDATE**: Test tool discovery, add_task, and list_tasks independently
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (Tool Registration) → Test independently → Foundation for all tools
3. Add US2 (add_task) → Test independently → Can create tasks
4. Add US3 (list_tasks) → Test independently → Can view tasks (MVP!)
5. Add US4 (update/complete) → Test independently → Can modify tasks
6. Add US5 (delete) → Test independently → Full CRUD complete
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Team completes US1 (Tool Registration) together
3. Once US1 is done:
   - Developer A: User Story 2 (add_task)
   - Developer B: User Story 3 (list_tasks)
   - Developer C: User Story 4 (update/complete)
   - Developer D: User Story 5 (delete)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- US1 is critical path - all other tools depend on it
- After US1, all tools (US2-US5) can be developed in parallel
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
