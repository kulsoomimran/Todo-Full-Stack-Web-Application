"""Pydantic schemas for MCP tool inputs and outputs"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class StrictBaseModel(BaseModel):
    """Base model with strict validation"""
    model_config = ConfigDict(
        strict=True,
        validate_assignment=True,
        extra='forbid'
    )


# Output Schemas
class TaskOutput(BaseModel):
    """Standard representation of a single task"""
    id: int = Field(description="Task identifier")
    title: str = Field(description="Task title")
    description: Optional[str] = Field(default=None, description="Task description")
    completed: bool = Field(description="Completion status")
    user_id: str = Field(description="Owner identifier")
    created_at: datetime = Field(description="Creation timestamp (UTC)")
    updated_at: datetime = Field(description="Last update timestamp (UTC)")

    model_config = ConfigDict(from_attributes=True)


class TaskListOutput(BaseModel):
    """Collection of tasks for list_tasks tool"""
    tasks: List[TaskOutput] = Field(description="Array of task objects")
    count: int = Field(description="Total number of tasks")


class DeleteTaskOutput(BaseModel):
    """Confirmation of successful deletion"""
    success: bool = Field(default=True, description="Always true on success")
    message: str = Field(description="Confirmation message")


# Input Schemas
class AddTaskInput(StrictBaseModel):
    """Input schema for add_task tool"""
    user_id: str = Field(min_length=1, description="User identifier")
    title: str = Field(min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(default=None, max_length=1000, description="Optional task description")


class ListTasksInput(StrictBaseModel):
    """Input schema for list_tasks tool"""
    user_id: str = Field(min_length=1, description="User identifier")


class UpdateTaskInput(StrictBaseModel):
    """Input schema for update_task tool"""
    user_id: str = Field(min_length=1, description="User identifier")
    task_id: int = Field(gt=0, description="Task identifier")
    title: Optional[str] = Field(default=None, min_length=1, max_length=255, description="New task title")
    description: Optional[str] = Field(default=None, max_length=1000, description="New task description")


class CompleteTaskInput(StrictBaseModel):
    """Input schema for complete_task tool"""
    user_id: str = Field(min_length=1, description="User identifier")
    task_id: int = Field(gt=0, description="Task identifier")


class DeleteTaskInput(StrictBaseModel):
    """Input schema for delete_task tool"""
    user_id: str = Field(min_length=1, description="User identifier")
    task_id: int = Field(gt=0, description="Task identifier")
