"""list_tasks tool implementation"""
import logging
from typing import Dict, Any
from ..schemas.tool_schemas import ListTasksInput, TaskListOutput, TaskOutput
from ..schemas.error_schemas import map_exception_to_error
from ..validators.auth_validator import validate_user_id
from ...services.todo_service import TodoService
from ...database.database import get_session

logger = logging.getLogger(__name__)


async def list_tasks(arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Retrieve all tasks for a user.
    
    Args:
        arguments: Tool input containing user_id
        
    Returns:
        TaskListOutput with all user tasks or ErrorResponse
    """
    try:
        # Validate input schema
        input_data = ListTasksInput(**arguments)
        
        # Validate user_id
        validated_user_id = validate_user_id(input_data.user_id)
        
        # Get tasks using service layer
        with get_session() as session:
            todo_responses = TodoService.get_todos_by_user(
                session=session,
                user_id=validated_user_id
            )
            
            # Convert to TaskOutput list
            tasks = [TaskOutput.model_validate(todo) for todo in todo_responses]
            
            result = TaskListOutput(tasks=tasks, count=len(tasks))
            logger.info(f"Successfully retrieved {len(tasks)} tasks for user {validated_user_id}")
            
            return result.model_dump(mode='json')
            
    except Exception as exc:
        error_response = map_exception_to_error(exc)
        logger.error(f"list_tasks failed: {error_response.error}")
        return error_response.model_dump()
