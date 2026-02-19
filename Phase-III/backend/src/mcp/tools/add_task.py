"""add_task tool implementation"""
import logging
from typing import Dict, Any
from ..schemas.tool_schemas import AddTaskInput, TaskOutput
from ..schemas.error_schemas import map_exception_to_error
from ..validators.auth_validator import validate_user_id
from ...services.todo_service import TodoService
from ...models.todo_model import TodoCreate
from ...database.database import get_session

logger = logging.getLogger(__name__)


async def add_task(arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new task for a user.
    
    Args:
        arguments: Tool input containing user_id, title, and optional description
        
    Returns:
        TaskOutput with created task details or ErrorResponse
    """
    try:
        # Validate input schema
        input_data = AddTaskInput(**arguments)
        
        # Validate user_id
        validated_user_id = validate_user_id(input_data.user_id)
        
        # Create task using service layer
        with get_session() as session:
            todo_data = TodoCreate(
                title=input_data.title,
                description=input_data.description,
                completed=False
            )
            
            todo_response = TodoService.create_todo(
                session=session,
                todo_data=todo_data,
                user_id=validated_user_id
            )
            
            # Convert to TaskOutput
            task_output = TaskOutput.model_validate(todo_response)
            logger.info(f"Successfully created task {task_output.id} for user {validated_user_id}")
            
            return task_output.model_dump(mode='json')
            
    except Exception as exc:
        error_response = map_exception_to_error(exc)
        logger.error(f"add_task failed: {error_response.error}")
        return error_response.model_dump()
