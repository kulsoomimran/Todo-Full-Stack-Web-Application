# Quickstart Guide: Todo Backend Core & Data Layer

## Prerequisites
- Python 3.11+
- pip package manager
- PostgreSQL (or Neon Serverless PostgreSQL connection)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Set up virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install fastapi sqlmodel uvicorn pytest psycopg2-binary python-dotenv
```

### 4. Configure environment variables
Create a `.env` file with the following:
```env
DATABASE_URL=postgresql://username:password@localhost/dbname
SECRET_KEY=your-secret-key-for-jwt-tokens
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Running the Backend

### 1. Start the development server
```bash
uvicorn main:app --reload
```

### 2. Access the API
- API endpoints: `http://localhost:8000/api/v1/todos`
- Interactive docs: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## API Usage Examples

### 1. Create a new task
```bash
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Sample task", "description": "Sample description", "completed": false}'
```

### 2. Get all tasks
```bash
curl -X GET http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Update a task
```bash
curl -X PUT http://localhost:8000/api/v1/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Updated task", "completed": true}'
```

### 4. Delete a task
```bash
curl -X DELETE http://localhost:8000/api/v1/todos/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Setup

### 1. Create database tables
```python
from sqlmodel import SQLModel
from database import engine

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

create_db_and_tables()
```

### 2. Run migrations (if using Alembic)
```bash
alembic revision --autogenerate -m "create todos table"
alembic upgrade head
```

## Testing

### 1. Run unit tests
```bash
pytest tests/unit/
```

### 2. Run integration tests
```bash
pytest tests/integration/
```

### 3. Run contract tests
```bash
pytest tests/contract/
```

## Configuration Options

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT token signing
- `ALGORITHM`: Algorithm for JWT token encoding
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiry duration
- `ENVIRONMENT`: Set to "production" for production mode

### Default Settings
- Port: 8000
- Host: localhost
- Auto-reload: enabled in development
- CORS: enabled for all origins in development

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Verify DATABASE_URL is correct and database server is running
2. **JWT Token Error**: Ensure SECRET_KEY is properly configured
3. **404 Not Found**: Check that routes match the expected API contract
4. **Permission Error**: Verify user_id scoping is working correctly

### Enable Debug Mode
Add `--debug` flag to uvicorn command to enable detailed error messages.

## Next Steps
- Implement authentication (Spec-2)
- Add user management endpoints
- Set up monitoring and logging
- Deploy to cloud platform