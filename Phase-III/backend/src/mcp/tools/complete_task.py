"""complete_task tool implementation"""
import logging
from typing import Dict, Any
from ..schemas.tool_schemas import CompleteTaskInput, TaskOutput
from ..schemas.error_schemas import map_exception_to_error
from ..validators.auth_validator import validate_user_id
from ...services.todo_service import TodoService
from ...models.todo_model import TodoUpdate
from ...database.database import get_session

logger = logging.getLogger(__name__)


async def complete_task(arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Toggle task completion status.
    
    Args:
        arguments: Tool input containing user_id and task_id
        
    Returns:
        TaskOutput with updated task or ErrorResponse
    """
    try:
        # Validate input schema
        input_data = CompleteTaskInput(**arguments)
        
        # Validate user_id
        validated_user_id = validate_user_id(input_data.user_id)
        
        # Get current task to toggle completion status
        with get_session() as session:
            # First get the task to check current status
            current_task = TodoService.get_todo_by_id(
                session=session,
                todo_id=input_data.task_id,
                user_id=validated_user_id
            )
            
            # Toggle completion status
            todo_data = TodoUpdate(completed=not current_task.completed)
            
            todo_response = TodoService.update_todo(
                session=session,
                todo_id=input_data.task_id,
                user_id=validated_user_id,
                todo_data=todo_data
            )
            
            # Convert to TaskOutput
            task_output = TaskOutput.model_validate(todo_response)
            logger.info(f"Successfully toggled completion for task {task_output.id} (completed={task_output.completed})")
            
            return task_output.model_dump(mode='json')
            
    except Exception as exc:
        error_response = map_exception_to_error(exc)
        logger.error(f"complete_task failed: {error_response.error}")
        return error_response.model_dump()
