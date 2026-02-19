# Quickstart Guide: MCP Server & Tooling Integration

**Date**: 2026-02-13
**Feature**: 001-mcp-todo-tools
**Audience**: Backend engineers implementing MCP tools

## Overview

This guide provides step-by-step instructions for setting up and running the MCP server with todo operation tools. The MCP server exposes 5 stateless tools for task management: add_task, list_tasks, update_task, complete_task, and delete_task.

## Prerequisites

- Python 3.11+ installed
- Existing FastAPI backend running
- PostgreSQL database with todos table
- Access to backend source code

## Installation

### 1. Install MCP SDK

Add the MCP SDK to your backend dependencies:

```bash
cd backend
pip install mcp
```

Or add to `requirements.txt`:

```txt
mcp>=1.0.0
```

Then install:

```bash
pip install -r requirements.txt
```

### 2. Verify Installation

```bash
python -c "import mcp; print(mcp.__version__)"
```

Expected output: `1.0.0` or higher

## Project Structure

The MCP server implementation will be organized as follows:

```
backend/src/mcp/
├── __init__.py              # Package initialization
├── server.py                # MCP server setup and tool registration
├── tools/                   # Tool implementations
│   ├── __init__.py
│   ├── add_task.py
│   ├── list_tasks.py
│   ├── update_task.py
│   ├── complete_task.py
│   └── delete_task.py
├── schemas/                 # Pydantic schemas for tools
│   ├── __init__.py
│   ├── tool_schemas.py      # Input/output schemas
│   └── error_schemas.py     # Error response schemas
└── validators/              # Validation utilities
    ├── __init__.py
    └── auth_validator.py    # User ID validation
```

## Configuration

### Environment Variables

Ensure your `.env` file includes:

```env
# Database connection (existing)
DATABASE_URL=postgresql://user:password@host:port/database

# MCP Server configuration (new)
MCP_SERVER_NAME=todo-tools-server
MCP_SERVER_VERSION=1.0.0
```

### Database Schema

Verify the `todos` table exists with the required schema:

```sql
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
```

## Running the MCP Server

### Option 1: Standalone Server (Recommended)

Run the MCP server as a separate process:

```bash
cd backend
python -m src.mcp.server
```

Expected output:
```
MCP Server 'todo-tools-server' starting...
Registered 5 tools: add_task, list_tasks, update_task, complete_task, delete_task
Server ready on stdio
```

### Option 2: Integrated with FastAPI

If integrating with the existing FastAPI application, add to `main.py`:

```python
from src.mcp.server import mcp_server

# Start MCP server alongside FastAPI
# (Implementation details TBD based on deployment requirements)
```

## Testing the Tools

### Using MCP Client

Install the MCP client for testing:

```bash
pip install mcp-client
```

### Test add_task

```python
from mcp.client import Client

async def test_add_task():
    client = Client("stdio", ["python", "-m", "src.mcp.server"])

    result = await client.call_tool("add_task", {
        "user_id": "test-user-123",
        "title": "Test task",
        "description": "Testing MCP integration"
    })

    print(result)
    # Expected: {"id": 1, "title": "Test task", ...}

# Run test
import asyncio
asyncio.run(test_add_task())
```

### Test list_tasks

```python
async def test_list_tasks():
    client = Client("stdio", ["python", "-m", "src.mcp.server"])

    result = await client.call_tool("list_tasks", {
        "user_id": "test-user-123"
    })

    print(result)
    # Expected: {"tasks": [...], "count": N}

asyncio.run(test_list_tasks())
```

### Test update_task

```python
async def test_update_task():
    client = Client("stdio", ["python", "-m", "src.mcp.server"])

    result = await client.call_tool("update_task", {
        "user_id": "test-user-123",
        "task_id": 1,
        "title": "Updated task title"
    })

    print(result)
    # Expected: {"id": 1, "title": "Updated task title", ...}

asyncio.run(test_update_task())
```

### Test complete_task

```python
async def test_complete_task():
    client = Client("stdio", ["python", "-m", "src.mcp.server"])

    result = await client.call_tool("complete_task", {
        "user_id": "test-user-123",
        "task_id": 1
    })

    print(result)
    # Expected: {"id": 1, "completed": true, ...}

asyncio.run(test_complete_task())
```

### Test delete_task

```python
async def test_delete_task():
    client = Client("stdio", ["python", "-m", "src.mcp.server"])

    result = await client.call_tool("delete_task", {
        "user_id": "test-user-123",
        "task_id": 1
    })

    print(result)
    # Expected: {"success": true, "message": "Task 1 deleted successfully"}

asyncio.run(test_delete_task())
```

## Tool Discovery

List all available tools:

```python
async def list_tools():
    client = Client("stdio", ["python", "-m", "src.mcp.server"])
    tools = await client.list_tools()

    for tool in tools:
        print(f"Tool: {tool.name}")
        print(f"Description: {tool.description}")
        print(f"Input Schema: {tool.input_schema}")
        print(f"Output Schema: {tool.output_schema}")
        print("---")

asyncio.run(list_tools())
```

Expected output:
```
Tool: add_task
Description: Create a new task for a user
Input Schema: {...}
Output Schema: {...}
---
Tool: list_tasks
Description: Retrieve all tasks for a user
Input Schema: {...}
Output Schema: {...}
---
[... 3 more tools ...]
```

## Error Handling

All tools return standardized error responses:

### Validation Error Example

```python
# Invalid input (missing required field)
result = await client.call_tool("add_task", {
    "user_id": "test-user-123"
    # Missing required "title" field
})

# Response:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "title",
      "constraint": "Field required"
    }
  }
}
```

### Auth Error Example

```python
# Invalid user_id
result = await client.call_tool("add_task", {
    "user_id": "",  # Empty string
    "title": "Test"
})

# Response:
{
  "error": {
    "code": "AUTH_ERROR",
    "message": "Invalid user ID format: "
  }
}
```

### Not Found Error Example

```python
# Non-existent task
result = await client.call_tool("update_task", {
    "user_id": "test-user-123",
    "task_id": 99999,
    "title": "Updated"
})

# Response:
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo with id 99999 not found"
  }
}
```

### Permission Denied Error Example

```python
# Attempting to access another user's task
result = await client.call_tool("update_task", {
    "user_id": "user-A",
    "task_id": 42,  # Belongs to user-B
    "title": "Updated"
})

# Response:
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "Access denied to todo with id 42"
  }
}
```

## Running Tests

### Unit Tests

```bash
cd backend
pytest tests/mcp/test_tool_schemas.py -v
```

### Integration Tests

```bash
pytest tests/mcp/test_add_task_tool.py -v
pytest tests/mcp/test_list_tasks_tool.py -v
pytest tests/mcp/test_update_task_tool.py -v
pytest tests/mcp/test_complete_task_tool.py -v
pytest tests/mcp/test_delete_task_tool.py -v
```

### User Isolation Tests

```bash
pytest tests/mcp/test_user_isolation.py -v
```

### All MCP Tests

```bash
pytest tests/mcp/ -v
```

## Monitoring

### Logging

The MCP server logs all tool invocations:

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mcp.server")

# Logs will show:
# INFO: Tool 'add_task' invoked by user 'user-123'
# INFO: Tool 'add_task' completed successfully in 45ms
# ERROR: Tool 'update_task' failed: NOT_FOUND
```

### Metrics

Track tool performance:

```python
# Tool invocation count
# Tool response time (p50, p95, p99)
# Error rate by error code
# User activity by user_id
```

## Troubleshooting

### Issue: "Module 'mcp' not found"

**Solution**: Install the MCP SDK:
```bash
pip install mcp
```

### Issue: "Database connection failed"

**Solution**: Verify DATABASE_URL in .env and ensure PostgreSQL is running:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: "Tool not found"

**Solution**: Verify tool registration in `server.py`:
```python
# Check that all 5 tools are registered
@server.tool()
async def add_task(...): ...

@server.tool()
async def list_tasks(...): ...

# etc.
```

### Issue: "Permission denied errors"

**Solution**: Verify user_id matches task ownership:
```sql
SELECT id, user_id FROM todos WHERE id = ?;
```

### Issue: "Validation errors"

**Solution**: Check input against JSON schema contracts in `specs/001-mcp-todo-tools/contracts/`

## Performance Optimization

### Connection Pooling

Reuse database connections:

```python
from src.database.database import get_session

# Use context manager for automatic cleanup
with get_session() as session:
    result = TodoService.create_todo(session, ...)
```

### Schema Validation Caching

Pydantic v2 caches compiled schemas for performance:

```python
from pydantic import BaseModel, ConfigDict

class AddTaskInput(BaseModel):
    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True
    )
```

### Concurrent Request Handling

MCP server handles async requests efficiently:

```python
# Multiple tools can execute concurrently
# Database connection pool limits concurrency
# Default pool size: 10 connections
```

## Security Checklist

- ✅ All tools require user_id parameter
- ✅ User_id validated before database operations
- ✅ Ownership validation for task-specific operations
- ✅ Error messages don't expose internal details
- ✅ Database queries use parameterized statements (SQLModel)
- ✅ No cross-user data access possible

## Next Steps

1. ✅ Install MCP SDK
2. ✅ Verify database schema
3. → Implement tool schemas (`backend/src/mcp/schemas/`)
4. → Implement tool functions (`backend/src/mcp/tools/`)
5. → Register tools in MCP server (`backend/src/mcp/server.py`)
6. → Write tests (`backend/tests/mcp/`)
7. → Run integration tests
8. → Deploy MCP server

## Additional Resources

- [MCP SDK Documentation](https://github.com/modelcontextprotocol/python-sdk)
- [Tool Schema Contracts](./contracts/)
- [Data Model Documentation](./data-model.md)
- [Implementation Plan](./plan.md)

---

**Quickstart Status**: ✅ Complete - Ready for implementation
