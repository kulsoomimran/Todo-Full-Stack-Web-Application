from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import logging
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TodoException(Exception):
    """Custom exception for todo-related errors"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class TodoNotFoundException(TodoException):
    """Exception raised when a todo is not found"""
    def __init__(self, todo_id: int):
        super().__init__(f"Todo with id {todo_id} not found", 404)

class UnauthorizedTodoAccessException(TodoException):
    """Exception raised when a user tries to access another user's todo"""
    def __init__(self, todo_id: int):
        super().__init__(f"Access denied to todo with id {todo_id}", 404)  # Return 404 to avoid revealing existence

async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "success": False}
    )

async def validation_exception_handler(request: Request, exc: ValidationError):
    """Handle validation exceptions"""
    logger.error(f"Validation Error: {exc}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "success": False}
    )

async def todo_exception_handler(request: Request, exc: TodoException):
    """Handle custom todo exceptions"""
    logger.error(f"Todo Exception: {exc.status_code} - {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message, "success": False}
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"General Exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "success": False}
    )

# Exception handlers for the app
exception_handlers = {
    HTTPException: http_exception_handler,
    ValidationError: validation_exception_handler,
    TodoException: todo_exception_handler,
    Exception: general_exception_handler
}