"""User ID validation for MCP tools"""
import logging

logger = logging.getLogger(__name__)


def validate_user_id(user_id: str) -> str:
    """
    Validate user_id is a non-empty string.
    
    Args:
        user_id: User identifier to validate
        
    Returns:
        Validated and stripped user_id
        
    Raises:
        ValueError: If user_id is invalid
    """
    if not user_id or not isinstance(user_id, str):
        logger.error(f"Invalid user_id format: {user_id}. Must be a non-empty string.")
        raise ValueError(f"Invalid user ID format: {user_id}")
    
    stripped_id = user_id.strip()
    if not stripped_id:
        logger.error("user_id is empty after stripping whitespace")
        raise ValueError("Invalid user ID format: empty string")
    
    return stripped_id
