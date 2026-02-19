---
id: 002
title: MCP Tools Implementation Plan
stage: plan
date: 2026-02-13
surface: agent
model: claude-sonnet-4-5
feature: mcp-todo-tools
branch: 001-mcp-todo-tools
user: developer
command: /sp.plan
labels: ["mcp", "architecture", "planning", "backend", "tools"]
links:
  spec: specs/001-mcp-todo-tools/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-mcp-todo-tools/plan.md
  - specs/001-mcp-todo-tools/research.md
  - specs/001-mcp-todo-tools/data-model.md
  - specs/001-mcp-todo-tools/quickstart.md
  - specs/001-mcp-todo-tools/contracts/add_task.json
  - specs/001-mcp-todo-tools/contracts/list_tasks.json
  - specs/001-mcp-todo-tools/contracts/update_task.json
  - specs/001-mcp-todo-tools/contracts/complete_task.json
  - specs/001-mcp-todo-tools/contracts/delete_task.json
  - specs/001-mcp-todo-tools/contracts/error_responses.json
tests:
  - Constitution Check: All 8 principles satisfied (PASS)
  - Technical Context: All unknowns resolved via research
  - Architecture Decisions: 6 key decisions documented with rationale
---

## Prompt

MCP Server & Tooling Integration

Create: MCP server architecture, tool registration, schema contracts, execution flow, validation strategy.

Decisions needing documentation:

Tool schema strictness (lenient vs strict)

Error response format (custom vs standard)

user_id enforcement (middleware vs per-tool)

Database access (ORM vs service layer)

Tool response (minimal vs enriched)

Versioning strategy

Testing strategy:

Schema validation per tool

User isolation & stateless checks

CRUD persistence

Failure case simulation

Ensure structured JSON responses

Technical details:

Reuse backend logic; no core rewrites

Stateless design; strict JSON I/O

Phases: Backend Review → MCP Setup → Tool Schema → Implementation → Security → Error Standardization → Testing

## Response snapshot

Created comprehensive implementation plan for MCP Server & Tooling Integration with complete Phase 0 and Phase 1 deliverables:

**Phase 0: Backend Review & Research** (research.md)
- Reviewed existing TodoService with 5 reusable CRUD operations
- Analyzed todo data model (id, user_id, title, description, completed, timestamps)
- Researched MCP SDK Python implementation (Pydantic integration, async support, error handling)
- Designed tool schema structure with strict validation
- Defined error code mapping (VALIDATION_ERROR, AUTH_ERROR, PERMISSION_DENIED, NOT_FOUND, SERVER_ERROR)
- Confirmed service layer reuse strategy

**Phase 1: Design & Contracts** (data-model.md, contracts/, quickstart.md)
- Documented 5 tool input schemas (AddTaskInput, ListTasksInput, UpdateTaskInput, CompleteTaskInput, DeleteTaskInput)
- Documented 3 tool output schemas (TaskOutput, TaskListOutput, DeleteTaskOutput)
- Documented standardized error response schema
- Created 6 JSON schema contract files for tool documentation
- Defined data flow diagrams (tool invocation, error handling)
- Created quickstart guide with installation, testing, and troubleshooting

**Architecture Decisions Documented**:
1. Tool Schema Strictness: Strict validation with Pydantic (no lenient parsing)
2. Error Response Format: MCP SDK standard with custom error codes
3. user_id Enforcement: Per-tool validation using shared validator utility
4. Database Access: Reuse existing service layer (no direct ORM access)
5. Tool Response: Enriched responses with complete task data
6. Versioning Strategy: No versioning in v1; prepare for future with tool name suffixes

**Constitution Check**: ✅ PASS
- All 8 core principles satisfied
- No violations requiring justification
- Security-first design enforced (user_id scoping, ownership validation)
- Stateless tool design (Principle IV: Deterministic Behavior)
- Service layer reuse (Principle VI: Technology Stack Non-Negotiability)

**Project Structure Defined**:
- backend/src/mcp/ (new module)
  - server.py (MCP server initialization)
  - tools/ (5 tool implementations)
  - schemas/ (Pydantic schemas)
  - validators/ (auth validation)
- backend/tests/mcp/ (test suite)

**Implementation Phases**:
- Phase 0: Backend Review & Research ✅ Complete
- Phase 1: Design & Contracts ✅ Complete
- Phase 2: Tool Implementation (pending /sp.tasks)
- Phase 3: Security & Error Standardization (pending /sp.tasks)
- Phase 4: Testing & Validation (pending /sp.tasks)

## Outcome

- ✅ Impact: Complete implementation plan with 6 documented architecture decisions, 10 tool schemas, 6 JSON contracts, and comprehensive quickstart guide. All technical unknowns resolved. Ready for task breakdown.
- 🧪 Tests: Constitution Check passed (8/8 principles), Technical Context validated (all unknowns resolved)
- 📁 Files: 10 files created (plan.md, research.md, data-model.md, quickstart.md, 6 JSON contracts)
- 🔁 Next prompts: Run `/sp.tasks` to generate task breakdown, then `/sp.implement` to execute implementation
- 🧠 Reflection: Planning phase comprehensive and unambiguous. All architecture decisions justified with clear rationale. Service layer reuse strategy minimizes implementation complexity. Strict schema validation ensures predictable tool behavior. Ready for task generation.

## Evaluation notes (flywheel)

- Failure modes observed: Agent context update script failed (template missing) - non-blocking, can be addressed later
- Graders run and results (PASS/FAIL): Constitution Check - PASS (8/8), Technical Context - PASS (all resolved)
- Prompt variant (if applicable): Standard /sp.plan workflow with user-provided architecture decision guidance
- Next experiment (smallest change to try): Generate tasks.md with /sp.tasks command to break down implementation into executable units
