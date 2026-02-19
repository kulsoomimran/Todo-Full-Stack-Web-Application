"""
MCP (Model Context Protocol) Server for Todo Operations

This module provides a stateless MCP server that exposes 5 todo CRUD tools:
- add_task: Create a new task
- list_tasks: Retrieve all tasks for a user
- update_task: Update task properties
- complete_task: Toggle task completion status
- delete_task: Permanently remove a task

All tools enforce user_id-based authorization and reuse existing TodoService.
"""

__version__ = "1.0.0"
