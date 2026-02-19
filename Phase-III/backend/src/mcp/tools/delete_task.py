"""delete_task tool implementation"""
import logging
from typing import Dict, Any
from ..schemas.tool_schemas import DeleteTaskInput, DeleteTaskOutput
from ..schemas.error_schemas import map_exception_to_error
from ..validators.auth_validator import validate_user_id
from ...services.todo_service import TodoService
from ...database.database import get_session

logger = logging.getLogger(__name__)


async def delete_task(arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Permanently delete a task.
    
    Args:
        arguments: Tool input containing user_id and task_id
        
    Returns:
        DeleteTaskOutput with success confirmation or ErrorResponse
    """
    try:
        # Validate input schema
        input_data = DeleteTaskInput(**arguments)
        
        # Validate user_id
        validated_user_id = validate_user_id(input_data.user_id)
        
        # Delete task using service layer
        with get_session() as session:
            TodoService.delete_todo(
                session=session,
                todo_id=input_data.task_id,
                user_id=validated_user_id
            )
            
            result = DeleteTaskOutput(
                success=True,
                message=f"Task {input_data.task_id} deleted successfully"
            )
            logger.info(f"Successfully deleted task {input_data.task_id} for user {validated_user_id}")
            
            return result.model_dump()
            
    except Exception as exc:
        error_response = map_exception_to_error(exc)
        logger.error(f"delete_task failed: {error_response.error}")
        return error_response.model_dump()
