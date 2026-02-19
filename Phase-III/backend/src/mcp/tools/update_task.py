"""update_task tool implementation"""
import logging
from typing import Dict, Any
from ..schemas.tool_schemas import UpdateTaskInput, TaskOutput
from ..schemas.error_schemas import map_exception_to_error
from ..validators.auth_validator import validate_user_id
from ...services.todo_service import TodoService
from ...models.todo_model import TodoUpdate
from ...database.database import get_session

logger = logging.getLogger(__name__)


async def update_task(arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update task properties (title and/or description).
    
    Args:
        arguments: Tool input containing user_id, task_id, and optional title/description
        
    Returns:
        TaskOutput with updated task or ErrorResponse
    """
    try:
        # Validate input schema
        input_data = UpdateTaskInput(**arguments)
        
        # Validate user_id
        validated_user_id = validate_user_id(input_data.user_id)
        
        # Update task using service layer
        with get_session() as session:
            todo_data = TodoUpdate(
                title=input_data.title,
                description=input_data.description
            )
            
            todo_response = TodoService.update_todo(
                session=session,
                todo_id=input_data.task_id,
                user_id=validated_user_id,
                todo_data=todo_data
            )
            
            # Convert to TaskOutput
            task_output = TaskOutput.model_validate(todo_response)
            logger.info(f"Successfully updated task {task_output.id} for user {validated_user_id}")
            
            return task_output.model_dump(mode='json')
            
    except Exception as exc:
        error_response = map_exception_to_error(exc)
        logger.error(f"update_task failed: {error_response.error}")
        return error_response.model_dump()
