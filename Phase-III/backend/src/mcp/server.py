"""MCP Server for Todo Operations

This module initializes the MCP server and registers all 5 todo tools.
"""
import logging
from typing import Any
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
import asyncio
import time

from .tools.add_task import add_task
from .tools.list_tasks import list_tasks
from .tools.update_task import update_task
from .tools.complete_task import complete_task
from .tools.delete_task import delete_task

logger = logging.getLogger(__name__)

# Initialize MCP server
server = Server("todo-tools-server")

# Tool invocation metrics
tool_metrics = {
    "add_task": {"count": 0, "total_latency": 0.0, "errors": 0},
    "list_tasks": {"count": 0, "total_latency": 0.0, "errors": 0},
    "update_task": {"count": 0, "total_latency": 0.0, "errors": 0},
    "complete_task": {"count": 0, "total_latency": 0.0, "errors": 0},
    "delete_task": {"count": 0, "total_latency": 0.0, "errors": 0},
}


def log_tool_invocation(tool_name: str, latency: float, success: bool):
    """Log tool invocation metrics"""
    if tool_name in tool_metrics:
        tool_metrics[tool_name]["count"] += 1
        tool_metrics[tool_name]["total_latency"] += latency
        if not success:
            tool_metrics[tool_name]["errors"] += 1

        avg_latency = tool_metrics[tool_name]["total_latency"] / tool_metrics[tool_name]["count"]
        logger.info(
            f"Tool '{tool_name}' invoked | "
            f"Success: {success} | "
            f"Latency: {latency:.3f}s | "
            f"Avg Latency: {avg_latency:.3f}s | "
            f"Total Calls: {tool_metrics[tool_name]['count']} | "
            f"Errors: {tool_metrics[tool_name]['errors']}"
        )


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available todo tools"""
    return [
        Tool(
            name="add_task",
            description="Create a new task for a user. Requires user_id, title, and optional description.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "minLength": 1, "description": "User ID who owns the task"},
                    "title": {"type": "string", "minLength": 1, "maxLength": 200, "description": "Task title"},
                    "description": {"type": "string", "maxLength": 1000, "description": "Optional task description"},
                },
                "required": ["user_id", "title"],
            },
        ),
        Tool(
            name="list_tasks",
            description="Retrieve all tasks for a specific user. Returns array of tasks with metadata.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "minLength": 1, "description": "User ID to filter tasks"},
                },
                "required": ["user_id"],
            },
        ),
        Tool(
            name="update_task",
            description="Update task properties (title, description, completed status). Validates ownership.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "minLength": 1, "description": "User ID making the update"},
                    "task_id": {"type": "integer", "minimum": 1, "description": "Task ID to update"},
                    "title": {"type": "string", "minLength": 1, "maxLength": 200, "description": "New task title"},
                    "description": {"type": "string", "maxLength": 1000, "description": "New task description"},
                    "completed": {"type": "boolean", "description": "New completion status"},
                },
                "required": ["user_id", "task_id"],
            },
        ),
        Tool(
            name="complete_task",
            description="Toggle task completion status. Validates ownership before updating.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "minLength": 1, "description": "User ID making the update"},
                    "task_id": {"type": "integer", "minimum": 1, "description": "Task ID to toggle"},
                },
                "required": ["user_id", "task_id"],
            },
        ),
        Tool(
            name="delete_task",
            description="Permanently delete a task. Validates ownership before deletion.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "minLength": 1, "description": "User ID making the deletion"},
                    "task_id": {"type": "integer", "minimum": 1, "description": "Task ID to delete"},
                },
                "required": ["user_id", "task_id"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Route tool calls to appropriate handlers with metrics tracking"""
    start_time = time.time()
    success = False

    try:
        logger.info(f"Tool invocation: {name} with arguments: {arguments}")

        if name == "add_task":
            result = await add_task(arguments)
        elif name == "list_tasks":
            result = await list_tasks(arguments)
        elif name == "update_task":
            result = await update_task(arguments)
        elif name == "complete_task":
            result = await complete_task(arguments)
        elif name == "delete_task":
            result = await delete_task(arguments)
        else:
            logger.error(f"Unknown tool: {name}")
            result = {"error": "VALIDATION_ERROR", "message": f"Unknown tool: {name}"}

        # Check if result indicates success
        success = "error" not in result

        latency = time.time() - start_time
        log_tool_invocation(name, latency, success)

        return [TextContent(type="text", text=str(result))]

    except Exception as e:
        latency = time.time() - start_time
        log_tool_invocation(name, latency, False)
        logger.exception(f"Unexpected error in tool '{name}': {e}")
        return [TextContent(type="text", text=str({"error": "SERVER_ERROR", "message": str(e)}))]


async def main():
    """Main entry point for MCP server"""
    logger.info("Starting MCP server 'todo-tools-server'")
    logger.info("Registered tools: add_task, list_tasks, update_task, complete_task, delete_task")

    async with stdio_server() as (read_stream, write_stream):
        logger.info("MCP server ready on stdio")
        await server.run(read_stream, write_stream)


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    asyncio.run(main())


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    asyncio.run(main())
