# Research: MCP Server & Tooling Integration

**Date**: 2026-02-13
**Feature**: 001-mcp-todo-tools
**Phase**: Phase 0 - Backend Review & Research

## Existing Backend Architecture Review

### Todo Service Layer (`backend/src/services/todo_service.py`)

**Available CRUD Operations**:

1. **`create_todo(session, todo_data, user_id)`**
   - Creates new todo with user_id association
   - Returns: `TodoResponse` (includes id, title, description, completed, user_id, timestamps)
   - Validates user_id format (non-empty string)
   - Handles database commit and refresh

2. **`get_todos_by_user(session, user_id, completed=None)`**
   - Retrieves all todos for a specific user
   - Optional filtering by completed status
   - Returns: `List[TodoResponse]`
   - Validates user_id format

3. **`get_todo_by_id(session, todo_id, user_id)`**
   - Retrieves specific todo with ownership validation
   - Raises `TodoNotFoundException` if not found
   - Returns: `TodoResponse`

4. **`update_todo(session, todo_id, user_id, todo_data)`**
   - Partial update (PATCH) with ownership validation
   - Accepts `TodoUpdate` schema (all fields optional)
   - Updates `updated_at` timestamp automatically
   - Raises `TodoNotFoundException` if not found
   - Returns: `TodoResponse`

5. **`delete_todo(session, todo_id, user_id)`**
   - Deletes todo with ownership validation
   - Raises `TodoNotFoundException` if not found
   - Returns: `bool` (True on success)

6. **`replace_todo(session, todo_id, user_id, todo_data)`**
   - Full replacement (PUT) with ownership validation
   - Not needed for MCP tools (update_todo covers this)

**Key Findings**:
- ✅ All operations enforce user_id scoping
- ✅ User_id validation already implemented (`_validate_user_id`)
- ✅ Ownership validation built into queries (WHERE user_id = ?)
- ✅ Consistent error handling with custom exceptions
- ✅ All operations return structured response models
- ✅ Timestamps managed automatically

**Reusability for MCP Tools**:
- Can directly reuse all 5 core operations
- No modifications needed to service layer
- MCP tools will wrap these service calls with MCP-specific schemas

---

### Todo Data Model (`backend/src/models/todo_model.py`)

**Database Schema** (`Todo` table):
```python
id: int (primary key, auto-increment)
user_id: str (foreign key to user.id, indexed, non-nullable)
title: str (1-255 chars, required)
description: Optional[str] (0-1000 chars)
completed: bool (default False)
created_at: datetime (UTC, auto-generated)
updated_at: datetime (UTC, auto-generated)
```

**Pydantic Schemas**:
- `TodoCreate`: title, description?, completed (default False)
- `TodoUpdate`: title?, description?, completed? (all optional for PATCH)
- `TodoResponse`: All fields including id, user_id, timestamps

**Key Findings**:
- ✅ Schema includes all required fields for MCP tools
- ✅ User_id stored as string (flexible format)
- ✅ Validation rules defined (min/max lengths)
- ✅ Timestamps automatically managed
- ✅ Completed status defaults to False

**Mapping to MCP Tool Schemas**:
- MCP tools will use similar Pydantic models
- Add user_id as explicit input parameter (not in TodoCreate)
- Maintain same validation rules for consistency

---

### Error Handling (`backend/src/core/error_handler.py`)

**Custom Exceptions**:
1. `TodoNotFoundException(todo_id)` - 404 status
2. `UnauthorizedTodoAccessException(todo_id)` - 404 status (security: don't reveal existence)
3. `TodoException(message, status_code)` - Base exception

**Error Response Format** (FastAPI):
```json
{
  "detail": "error message",
  "success": false
}
```

**Key Findings**:
- ✅ Consistent exception hierarchy
- ✅ Security-conscious (404 for unauthorized access)
- ✅ Logging integrated
- ✅ Validation errors handled (422 status)

**Adaptation for MCP Tools**:
- Need to map FastAPI exceptions to MCP error format
- MCP error format: `{"error": {"code": "...", "message": "...", "details": {...}}}`
- Create mapping layer in MCP tools

---

## MCP SDK Research

### MCP SDK for Python

**Official Package**: `mcp` (Model Context Protocol SDK)

**Installation**:
```bash
pip install mcp
```

**Core Components**:

1. **Server Initialization**:
```python
from mcp.server import Server
from mcp.server.stdio import stdio_server

server = Server("todo-tools-server")
```

2. **Tool Registration**:
```python
from mcp.server.models import Tool
from pydantic import BaseModel

class AddTaskInput(BaseModel):
    user_id: str
    title: str
    description: str | None = None

@server.tool()
async def add_task(input: AddTaskInput) -> dict:
    # Tool implementation
    return {"id": 1, "title": input.title, ...}
```

3. **Schema Definition**:
- Uses Pydantic models for input/output schemas
- Automatic JSON schema generation
- Built-in validation

4. **Error Handling**:
```python
from mcp.server.models import McpError

raise McpError(
    code="VALIDATION_ERROR",
    message="Invalid input",
    data={"field": "title", "error": "required"}
)
```

5. **Server Lifecycle**:
```python
async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream)
```

**Key Findings**:
- ✅ Pydantic integration for schemas (compatible with existing models)
- ✅ Decorator-based tool registration (@server.tool())
- ✅ Async/await support (compatible with FastAPI)
- ✅ Built-in error handling with McpError
- ✅ Automatic schema discovery and documentation

**Integration Approach**:
- Create separate MCP server module in `backend/src/mcp/`
- Use Pydantic models for tool schemas
- Wrap existing service layer calls in async tool functions
- Map service exceptions to McpError

---

## MCP Tool Schema Design

### Standard Error Codes

Based on MCP SDK conventions and spec requirements:

```python
class ErrorCode(str, Enum):
    VALIDATION_ERROR = "VALIDATION_ERROR"      # Invalid input (400)
    AUTH_ERROR = "AUTH_ERROR"                  # Missing/invalid user_id (401)
    PERMISSION_DENIED = "PERMISSION_DENIED"    # Unauthorized access (403)
    NOT_FOUND = "NOT_FOUND"                    # Resource not found (404)
    SERVER_ERROR = "SERVER_ERROR"              # Internal error (500)
```

### Tool Input Schemas

All tools require `user_id` as first parameter:

```python
class AddTaskInput(BaseModel):
    user_id: str = Field(min_length=1, description="User identifier")
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)

class ListTasksInput(BaseModel):
    user_id: str = Field(min_length=1, description="User identifier")

class UpdateTaskInput(BaseModel):
    user_id: str = Field(min_length=1, description="User identifier")
    task_id: int = Field(gt=0, description="Task identifier")
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)

class CompleteTaskInput(BaseModel):
    user_id: str = Field(min_length=1, description="User identifier")
    task_id: int = Field(gt=0, description="Task identifier")

class DeleteTaskInput(BaseModel):
    user_id: str = Field(min_length=1, description="User identifier")
    task_id: int = Field(gt=0, description="Task identifier")
```

### Tool Output Schemas

```python
class TaskOutput(BaseModel):
    id: int
    title: str
    description: str | None
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime

class TaskListOutput(BaseModel):
    tasks: List[TaskOutput]
    count: int

class DeleteTaskOutput(BaseModel):
    success: bool
    message: str
```

---

## Database Access Strategy

**Decision**: Reuse existing service layer

**Rationale**:
- Service layer already implements all required operations
- User_id validation and scoping already enforced
- Error handling already implemented
- Maintains single source of truth
- Simplifies testing (service layer already tested)

**Implementation Pattern**:
```python
from ..services.todo_service import TodoService
from ..database.database import get_session

@server.tool()
async def add_task(input: AddTaskInput) -> TaskOutput:
    try:
        with get_session() as session:
            todo_response = TodoService.create_todo(
                session=session,
                todo_data=TodoCreate(
                    title=input.title,
                    description=input.description
                ),
                user_id=input.user_id
            )
            return TaskOutput.model_validate(todo_response)
    except ValueError as e:
        raise McpError(code="AUTH_ERROR", message=str(e))
    except TodoNotFoundException as e:
        raise McpError(code="NOT_FOUND", message=str(e))
    except Exception as e:
        logger.error(f"Server error: {e}")
        raise McpError(code="SERVER_ERROR", message="Internal server error")
```

---

## Testing Strategy

### Unit Tests
- Tool schema validation (Pydantic)
- Error code mapping
- Input/output transformation

### Integration Tests
- End-to-end tool invocation with real database
- User isolation enforcement
- Service layer integration

### Test Utilities
```python
from mcp.server.testing import create_test_server

async def test_add_task():
    server = create_test_server()
    result = await server.call_tool("add_task", {
        "user_id": "test-user",
        "title": "Test task"
    })
    assert result["id"] is not None
```

---

## Performance Considerations

**Database Connection**:
- Reuse existing connection pool from FastAPI
- Each tool invocation gets session from pool
- No persistent connections (stateless)

**Schema Validation Overhead**:
- Pydantic validation: ~1-5ms per request
- Acceptable for <500ms p95 target
- Can optimize with Pydantic v2 if needed

**Concurrent Requests**:
- MCP server handles async requests
- Database connection pool limits concurrency
- Current pool size: 10 connections (check main.py)
- May need to increase for 100 concurrent target

---

## Deployment Architecture

**Option 1: Standalone MCP Server** (Recommended)
```
┌─────────────────┐
│   AI Agent      │
└────────┬────────┘
         │ MCP Protocol
┌────────▼────────┐
│  MCP Server     │
│  (Python)       │
└────────┬────────┘
         │ Service Layer
┌────────▼────────┐
│  Database       │
│  (PostgreSQL)   │
└─────────────────┘
```

**Option 2: Integrated with FastAPI**
```
┌─────────────────┐
│   AI Agent      │
└────────┬────────┘
         │ MCP Protocol
┌────────▼────────────────┐
│  FastAPI + MCP Server   │
│  (Single Process)       │
└────────┬────────────────┘
         │
┌────────▼────────┐
│  Database       │
│  (PostgreSQL)   │
└─────────────────┘
```

**Recommendation**: Start with Option 1 for simplicity and clear separation. Can migrate to Option 2 if deployment complexity becomes an issue.

---

## Key Decisions Summary

1. **Schema Strictness**: Strict validation with Pydantic (no lenient parsing)
2. **Error Format**: MCP SDK standard with custom error codes
3. **user_id Enforcement**: Per-tool validation using existing service layer
4. **Database Access**: Reuse existing service layer (no direct ORM access)
5. **Tool Response**: Enriched responses with complete task data
6. **Versioning**: No versioning in v1; prepare for future with tool name suffixes

---

## Next Steps

1. ✅ Research complete - All unknowns resolved
2. → Create data-model.md (Phase 1)
3. → Create tool contracts in JSON format (Phase 1)
4. → Create quickstart.md (Phase 1)
5. → Update agent context (Phase 1)
6. → Generate tasks.md (/sp.tasks command)

---

**Research Status**: ✅ Complete - Ready for Phase 1 design
