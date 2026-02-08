"""
This file is created to satisfy the project structure but the actual schema definitions
are in the models file (backend/src/models/todo_model.py) where they're properly defined
as SQLModel classes that can be used for both database operations and API requests.
"""
from ..models.todo_model import TodoCreate, TodoUpdate, TodoResponse

# The actual schema classes are defined in the models file
# This file exists to maintain the project structure as specified
# All imports should come from the models file directly