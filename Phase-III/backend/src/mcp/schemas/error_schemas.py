"""Error schemas and utilities for MCP tools"""
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class ErrorCode(str, Enum):
    """Standardized error codes for MCP tools"""
    VALIDATION_ERROR = "VALIDATION_ERROR"
    AUTH_ERROR = "AUTH_ERROR"
    PERMISSION_DENIED = "PERMISSION_DENIED"
    NOT_FOUND = "NOT_FOUND"
    SERVER_ERROR = "SERVER_ERROR"


class ErrorResponse(BaseModel):
    """Standardized error response format"""
    error: Dict[str, Any] = Field(
        description="Error details"
    )

    @classmethod
    def create(
        cls,
        code: ErrorCode,
        message: str,
        details: Optional[Dict[str, Any]] = None
    ) -> "ErrorResponse":
        """Create a standardized error response"""
        error_dict = {
            "code": code.value,
            "message": message
        }
        if details:
            error_dict["details"] = details
        return cls(error=error_dict)


def map_exception_to_error(exc: Exception) -> ErrorResponse:
    """Map service layer exceptions to MCP error responses"""
    from ...core.error_handler import TodoNotFoundException, UnauthorizedTodoAccessException
    
    if isinstance(exc, ValueError):
        # User ID validation errors
        return ErrorResponse.create(
            code=ErrorCode.AUTH_ERROR,
            message=str(exc)
        )
    elif isinstance(exc, TodoNotFoundException):
        return ErrorResponse.create(
            code=ErrorCode.NOT_FOUND,
            message=str(exc)
        )
    elif isinstance(exc, UnauthorizedTodoAccessException):
        return ErrorResponse.create(
            code=ErrorCode.PERMISSION_DENIED,
            message=str(exc)
        )
    else:
        # Generic server error
        logger.error(f"Unexpected error in MCP tool: {exc}", exc_info=True)
        return ErrorResponse.create(
            code=ErrorCode.SERVER_ERROR,
            message="Internal server error"
        )
