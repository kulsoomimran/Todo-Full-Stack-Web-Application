from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from .api.todo_router import todo_router
from .api.auth_router import router as auth_router
from .core import auth, error_handler

# Load environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="Todo API",
    description="A simple todo application API with user-scoped tasks",
    version="1.0.0",
    exception_handlers=error_handler.exception_handlers,
)

# Include routers
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
app.include_router(todo_router, prefix="/api/v1", tags=["todos"])

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Add your frontend origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Add middleware
# Note: Authentication middleware will be added in Spec-2
# For now, we're focusing on the core functionality

# Global exception handlers for consistent error responses
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Global handler for HTTP exceptions to ensure consistent error responses
    per auth-context contract with proper status codes.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handler for validation errors to return consistent 422 responses.
    """
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
            "status_code": 422,
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    General exception handler for unexpected errors.
    Returns 500 with generic message to prevent information leakage.
    """
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "status_code": 500,
        }
    )

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}

@app.on_event("startup")
def on_startup():
    from .database.database import create_tables
    create_tables()


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}