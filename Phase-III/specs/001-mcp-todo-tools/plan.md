# Implementation Plan: MCP Server & Tooling Integration for Todo Operations

**Branch**: `001-mcp-todo-tools` | **Date**: 2026-02-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mcp-todo-tools/spec.md`

## Summary

This feature exposes the existing todo CRUD operations as stateless, schema-defined MCP tools for AI agent consumption. The implementation creates an MCP server that registers 5 tools (add_task, list_tasks, update_task, complete_task, delete_task) with strict JSON schema contracts, user_id-based authorization, and standardized error handling. All tools are stateless and reuse existing backend business logic, with database persistence handled within the tool execution layer.

## Technical Context

**Language/Version**: Python 3.11 (existing backend requirement)
**Primary Dependencies**:
- Official MCP SDK (Python) for tool registration and server implementation
- FastAPI (existing backend framework)
- SQLModel (existing ORM)
- Pydantic v2 (for schema validation)

**Storage**: Neon Serverless PostgreSQL (existing database with task table including user_id)
**Testing**: pytest (existing test framework), MCP SDK test utilities
**Target Platform**: Linux server (same as existing FastAPI backend)
**Project Type**: Web backend extension (MCP server as separate module)
**Performance Goals**:
- Tool response time <500ms p95
- Support 100 concurrent tool invocations
- Schema validation overhead <10ms per request

**Constraints**:
- Must reuse existing backend logic (no core rewrites)
- Stateless tool design only (no session/conversation state)
- Strict JSON I/O contracts (no lenient parsing)
- User_id enforcement on every tool invocation

**Scale/Scope**:
- 5 tools total
- Single MCP server process
- Shared database with existing backend
- Expected load: 10-100 requests/second

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance with Core Principles

✅ **I. Spec-Driven Development (SDD)**
- Specification complete and approved (spec.md)
- Implementation plan follows spec requirements
- All tool contracts traceable to functional requirements

✅ **II. Agentic Workflow Compliance**
- Following Specification → Planning → Task Breakdown → Implementation workflow
- Will use fastapi-backend-developer agent for MCP server implementation

✅ **III. Security-First Design**
- All tools enforce user_id authentication (FR-004, FR-005)
- Ownership validation for task-specific operations (FR-006)
- No cross-user data access (SC-004)
- Error responses don't expose internal details (FR-016)

✅ **IV. Deterministic Behavior**
- Stateless tool design ensures same input → same output (FR-008)
- Standardized error responses with consistent codes (FR-007, FR-016)
- No race conditions (stateless execution)

✅ **V. Full-Stack Coherence**
- MCP tools integrate with existing backend via service layer
- Database schema already includes user_id for task ownership
- Tool contracts defined and validated

✅ **VI. Technology Stack Non-Negotiability**
- Uses Python FastAPI backend (existing)
- Uses SQLModel ORM (existing)
- Uses Neon PostgreSQL (existing)
- Adds Official MCP SDK (approved for AI agent integration)

✅ **VII. AI Agent-First Architecture**
- Clear separation: AI Agent → MCP Tools → Database
- Tools don't access database directly; use existing service layer
- Stateless tool execution
- Natural language requests translated to structured tool calls (handled by AI agent, not tools)

✅ **VIII. MCP Tool Compliance**
- All tools are stateless and schema-defined (FR-002, FR-003, FR-008)
- Tools follow official MCP SDK standards
- User scoping enforced (FR-004, FR-005, FR-006)
- All actions traceable and persisted in database

### Gate Status: ✅ PASS

No constitution violations. All principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/001-mcp-todo-tools/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
├── contracts/           # Phase 1 output (to be created)
│   ├── add_task.json
│   ├── list_tasks.json
│   ├── update_task.json
│   ├── complete_task.json
│   ├── delete_task.json
│   └── error_responses.json
├── checklists/
│   └── requirements.md  # Quality checklist (complete)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # Existing: task_model.py (Task SQLModel)
│   ├── services/        # Existing: task_service.py (CRUD operations)
│   ├── api/             # Existing: task_router.py (REST endpoints)
│   ├── mcp/             # NEW: MCP server implementation
│   │   ├── __init__.py
│   │   ├── server.py    # MCP server initialization and tool registration
│   │   ├── tools/       # Tool implementations
│   │   │   ├── __init__.py
│   │   │   ├── add_task.py
│   │   │   ├── list_tasks.py
│   │   │   ├── update_task.py
│   │   │   ├── complete_task.py
│   │   │   └── delete_task.py
│   │   ├── schemas/     # Tool input/output schemas
│   │   │   ├── __init__.py
│   │   │   ├── tool_schemas.py
│   │   │   └── error_schemas.py
│   │   └── validators/  # Input validation and user_id enforcement
│   │       ├── __init__.py
│   │       └── auth_validator.py
│   └── main.py          # Existing: FastAPI app (may need MCP server integration)
└── tests/
    ├── unit/            # Existing unit tests
    ├── integration/     # Existing integration tests
    └── mcp/             # NEW: MCP tool tests
        ├── test_tool_schemas.py
        ├── test_add_task_tool.py
        ├── test_list_tasks_tool.py
        ├── test_update_task_tool.py
        ├── test_complete_task_tool.py
        ├── test_delete_task_tool.py
        └── test_user_isolation.py
```

**Structure Decision**: Web application structure (Option 2) with backend extension. The MCP server is implemented as a new module (`backend/src/mcp/`) within the existing FastAPI backend. This allows reuse of existing models, services, and database connections while maintaining clear separation of concerns. The MCP server can run as a separate process or be integrated into the main FastAPI application depending on deployment requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. This section is not applicable.

## Architecture Decisions

### Decision 1: Tool Schema Strictness

**Decision**: Strict schema validation with no lenient parsing

**Rationale**:
- Ensures predictable tool behavior (Constitution Principle IV: Deterministic Behavior)
- Prevents ambiguous inputs that could lead to security issues
- Aligns with FR-017 requirement for detailed validation errors
- MCP SDK provides built-in strict validation support

**Alternatives Considered**:
- Lenient parsing with defaults: Rejected because it introduces unpredictability and potential security risks
- Hybrid approach (strict for required, lenient for optional): Rejected for consistency

**Implementation**: Use Pydantic v2 strict mode for all tool input schemas

---

### Decision 2: Error Response Format

**Decision**: Standardized error format following MCP SDK conventions with custom error codes

**Rationale**:
- MCP SDK defines standard error response structure
- Custom error codes provide specific context (auth, validation, not_found, server_error)
- Aligns with FR-016 requirement for standardized error responses
- Consistent with existing backend error handling (Constitution: API & REST Standards)

**Alternatives Considered**:
- Fully custom format: Rejected because it breaks MCP SDK compatibility
- Generic HTTP-only errors: Rejected because it lacks specificity for tool consumers

**Implementation**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR" | "AUTH_ERROR" | "NOT_FOUND" | "PERMISSION_DENIED" | "SERVER_ERROR",
    "message": "Human-readable error message",
    "details": {
      "field": "specific field that failed",
      "constraint": "validation rule violated"
    }
  }
}
```

---

### Decision 3: user_id Enforcement Strategy

**Decision**: Per-tool validation with shared validator utility

**Rationale**:
- Each tool explicitly validates user_id before execution (clear ownership)
- Shared validator utility (`auth_validator.py`) ensures consistency
- No middleware complexity (stateless tools don't benefit from middleware)
- Aligns with FR-005 requirement for validation before operations
- Easier to test and debug (validation logic co-located with tool)

**Alternatives Considered**:
- Middleware approach: Rejected because MCP tools are stateless and don't use HTTP middleware patterns
- Database-level enforcement only: Rejected because it doesn't provide early validation feedback

**Implementation**: Each tool calls `validate_user_id(user_id)` at entry point, raises standardized error if invalid

---

### Decision 4: Database Access Pattern

**Decision**: Service layer reuse (existing task_service.py)

**Rationale**:
- Aligns with FR-015 requirement to reuse existing backend logic
- Avoids code duplication and maintains single source of truth
- Service layer already implements user_id scoping and validation
- Simplifies testing (service layer already has test coverage)
- Maintains architectural consistency with existing backend

**Alternatives Considered**:
- Direct ORM access in tools: Rejected because it violates DRY and bypasses existing business logic
- New MCP-specific service layer: Rejected because it duplicates existing functionality

**Implementation**: Tools import and call existing `task_service` functions (create_task, get_tasks_by_user, update_task, delete_task)

---

### Decision 5: Tool Response Format

**Decision**: Enriched responses with complete task data

**Rationale**:
- Aligns with FR-010 requirement for complete task details
- Reduces need for follow-up queries (list_tasks after add_task)
- Provides immediate feedback for AI agent context
- Includes timestamps for audit trail (created_at, updated_at)
- Consistent with existing REST API response format

**Alternatives Considered**:
- Minimal responses (ID only): Rejected because it requires additional queries for task details
- Partial responses (configurable fields): Rejected for simplicity and consistency

**Implementation**: All tools return full task object(s) with id, title, description, completed, user_id, created_at, updated_at

---

### Decision 6: Versioning Strategy

**Decision**: No versioning in initial implementation; prepare for future versioning

**Rationale**:
- Initial release (v1 implicit)
- MCP SDK supports tool versioning via tool names (e.g., `add_task_v2`)
- Schema evolution can be handled by adding new tools rather than modifying existing ones
- Aligns with Constitution principle of simplicity (no premature complexity)

**Alternatives Considered**:
- Explicit v1 prefix on all tools: Rejected because it adds unnecessary complexity for initial release
- Version parameter in tool input: Rejected because MCP SDK handles versioning at tool registration level

**Implementation**: Tools registered without version suffix; future versions will use `{tool_name}_v2` naming convention

---

## Implementation Phases

### Phase 0: Backend Review & Research (Pre-Implementation)

**Objective**: Understand existing backend architecture and resolve technical unknowns

**Tasks**:
1. Review existing task service layer (`backend/src/services/task_service.py`)
   - Identify reusable CRUD functions
   - Document function signatures and return types
   - Verify user_id scoping implementation

2. Review existing task model (`backend/src/models/task_model.py`)
   - Confirm schema includes user_id, id, title, description, completed, timestamps
   - Verify SQLModel configuration

3. Research MCP SDK Python implementation
   - Tool registration API
   - Schema definition format (Pydantic integration)
   - Error handling patterns
   - Server lifecycle management

4. Research MCP SDK testing utilities
   - Tool invocation testing
   - Schema validation testing
   - Mock server setup

**Output**: `research.md` documenting findings and confirming technical approach

---

### Phase 1: MCP Server Setup & Tool Schema Definition

**Objective**: Create MCP server infrastructure and define tool contracts

**Tasks**:
1. Install MCP SDK Python package
   - Add to `backend/requirements.txt`
   - Verify compatibility with existing dependencies

2. Create MCP server module structure
   - `backend/src/mcp/` directory
   - `server.py` with MCP server initialization
   - Tool registration framework

3. Define tool input/output schemas (`backend/src/mcp/schemas/tool_schemas.py`)
   - AddTaskInput (user_id, title, description?)
   - ListTasksInput (user_id)
   - UpdateTaskInput (user_id, task_id, title?, description?)
   - CompleteTaskInput (user_id, task_id)
   - DeleteTaskInput (user_id, task_id)
   - TaskOutput (id, title, description, completed, user_id, created_at, updated_at)
   - TaskListOutput (tasks: List[TaskOutput])

4. Define error schemas (`backend/src/mcp/schemas/error_schemas.py`)
   - ErrorResponse (code, message, details?)
   - Error codes enum (VALIDATION_ERROR, AUTH_ERROR, NOT_FOUND, PERMISSION_DENIED, SERVER_ERROR)

5. Create auth validator utility (`backend/src/mcp/validators/auth_validator.py`)
   - `validate_user_id(user_id: str) -> None` (raises error if invalid)
   - User ID format validation (non-empty string)

6. Generate JSON schema contracts for documentation
   - Export Pydantic schemas to JSON files in `specs/001-mcp-todo-tools/contracts/`
   - One file per tool (add_task.json, list_tasks.json, etc.)
   - error_responses.json for standardized error format

**Output**:
- `data-model.md` documenting tool schemas and data flow
- `contracts/` directory with JSON schema files
- `quickstart.md` with MCP server setup instructions

---

### Phase 2: Tool Implementation

**Objective**: Implement all 5 MCP tools with service layer integration

**Tasks**:
1. Implement `add_task` tool (`backend/src/mcp/tools/add_task.py`)
   - Validate user_id
   - Validate input schema (title required, description optional)
   - Call `task_service.create_task(user_id, title, description)`
   - Return TaskOutput with created task
   - Handle errors (validation, database)

2. Implement `list_tasks` tool (`backend/src/mcp/tools/list_tasks.py`)
   - Validate user_id
   - Call `task_service.get_tasks_by_user(user_id)`
   - Return TaskListOutput with all user tasks
   - Handle errors (validation, database)

3. Implement `update_task` tool (`backend/src/mcp/tools/update_task.py`)
   - Validate user_id
   - Validate task_id ownership (call service layer to verify)
   - Call `task_service.update_task(task_id, title, description)`
   - Return TaskOutput with updated task
   - Handle errors (validation, not found, permission denied, database)

4. Implement `complete_task` tool (`backend/src/mcp/tools/complete_task.py`)
   - Validate user_id
   - Validate task_id ownership
   - Call `task_service.toggle_task_completion(task_id)`
   - Return TaskOutput with updated task
   - Handle errors (validation, not found, permission denied, database)

5. Implement `delete_task` tool (`backend/src/mcp/tools/delete_task.py`)
   - Validate user_id
   - Validate task_id ownership
   - Call `task_service.delete_task(task_id)`
   - Return success confirmation
   - Handle errors (validation, not found, permission denied, database)

6. Register all tools in MCP server (`backend/src/mcp/server.py`)
   - Tool registration with schemas
   - Server initialization
   - Lifecycle management (startup/shutdown)

**Output**: Fully functional MCP server with all 5 tools registered

---

### Phase 3: Security & Error Standardization

**Objective**: Ensure robust security and consistent error handling

**Tasks**:
1. Implement user_id validation in auth_validator
   - Non-empty string check
   - Format validation (if specific format required)
   - Raise AUTH_ERROR for invalid user_id

2. Implement ownership validation for task-specific tools
   - Verify task belongs to user before modification
   - Raise PERMISSION_DENIED if ownership check fails
   - Raise NOT_FOUND if task doesn't exist

3. Standardize error responses across all tools
   - Map service layer exceptions to MCP error codes
   - Ensure error messages are user-friendly
   - Include relevant context in error details
   - Never expose internal system details (stack traces, DB errors)

4. Add input validation error handling
   - Pydantic validation errors → VALIDATION_ERROR
   - Include field name and constraint in error details

5. Add database error handling
   - Connection errors → SERVER_ERROR
   - Transaction errors → SERVER_ERROR
   - Log errors server-side with context

**Output**: Secure, robust error handling across all tools

---

### Phase 4: Testing & Validation

**Objective**: Comprehensive test coverage for all tools and scenarios

**Tasks**:
1. Schema validation tests (`backend/tests/mcp/test_tool_schemas.py`)
   - Valid inputs pass validation
   - Invalid inputs raise VALIDATION_ERROR
   - Optional fields handled correctly
   - Output schemas match expected format

2. Tool functionality tests (one file per tool)
   - Happy path: valid inputs produce expected outputs
   - Task persistence: changes reflected in database
   - User isolation: can't access other users' tasks
   - Error scenarios: invalid user_id, missing task, permission denied

3. User isolation tests (`backend/tests/mcp/test_user_isolation.py`)
   - User A can't list User B's tasks
   - User A can't update User B's tasks
   - User A can't complete User B's tasks
   - User A can't delete User B's tasks

4. Stateless verification tests
   - Multiple invocations with same input produce same output
   - No state leakage between tool invocations
   - Concurrent invocations don't interfere

5. Error handling tests
   - All error codes tested (VALIDATION_ERROR, AUTH_ERROR, NOT_FOUND, PERMISSION_DENIED, SERVER_ERROR)
   - Error messages are user-friendly
   - Error details provide actionable information

6. Performance tests
   - Tool response time <500ms p95
   - 100 concurrent invocations handled successfully
   - Schema validation overhead <10ms

**Output**: Comprehensive test suite with >90% coverage

---

## Testing Strategy

### Unit Tests
- Tool input/output schema validation
- Auth validator logic
- Error response formatting
- Service layer integration (mocked)

### Integration Tests
- End-to-end tool invocation with real database
- User isolation enforcement
- CRUD operation persistence
- Error propagation from service layer

### Contract Tests
- Tool schemas match JSON contract files
- Input validation matches schema definitions
- Output format matches schema definitions

### Security Tests
- User_id validation enforcement
- Ownership validation for task-specific operations
- Cross-user access prevention
- Error messages don't leak sensitive data

### Performance Tests
- Tool response time under load
- Concurrent invocation handling
- Schema validation overhead measurement

---

## Deployment Considerations

### MCP Server Deployment Options

**Option 1: Standalone Process** (Recommended for initial implementation)
- MCP server runs as separate Python process
- Communicates with database directly (same connection pool as FastAPI)
- Independent scaling and monitoring
- Simpler to debug and test

**Option 2: Integrated with FastAPI**
- MCP server embedded in existing FastAPI application
- Shares database connection pool and configuration
- Single deployment artifact
- May require FastAPI-MCP integration layer

**Decision**: Start with Option 1 (standalone) for simplicity; evaluate Option 2 if deployment complexity becomes an issue.

### Configuration
- Database connection string (from .env)
- MCP server port/socket configuration
- Logging configuration
- Error reporting configuration

### Monitoring
- Tool invocation metrics (count, latency, errors)
- User_id validation failures
- Database operation performance
- Error rate by error code

---

## Success Metrics

Aligned with Success Criteria from spec.md:

- **SC-001**: All 5 tools registered and discoverable ✓
- **SC-002**: 100% schema compliance for valid inputs ✓
- **SC-003**: 100% standardized errors for invalid inputs ✓
- **SC-004**: 100% user_id ownership validation ✓
- **SC-005**: <500ms response time p95 ✓
- **SC-006**: Database persistence verified ✓
- **SC-007**: 100 concurrent invocations supported ✓
- **SC-008**: Zero security vulnerabilities ✓
- **SC-009**: All error scenarios handled ✓
- **SC-010**: Complete schema documentation ✓

---

## Next Steps

After this planning phase:

1. **Execute Phase 0**: Create `research.md` by reviewing existing backend code and MCP SDK documentation
2. **Execute Phase 1**: Create `data-model.md`, `contracts/`, and `quickstart.md`
3. **Run `/sp.tasks`**: Generate detailed task breakdown from this plan
4. **Run `/sp.implement`**: Execute tasks via fastapi-backend-developer agent
5. **Create ADR**: Document architectural decisions (schema strictness, service layer reuse, error format)

---

**Plan Status**: ✅ Complete - Ready for Phase 0 research
