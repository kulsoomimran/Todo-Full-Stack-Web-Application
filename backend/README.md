# Todo Backend API

A FastAPI-based backend for managing todo tasks with user-scoped data access.

## Features

- RESTful API for todo task management
- Create, Read, Update, and Delete (CRUD) operations
- User-scoped data isolation (each user can only access their own tasks)
- Proper error handling and validation
- SQLModel ORM for database operations

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: PostgreSQL (with Neon support)
- **Language**: Python 3.11

## Endpoints

### Create a Todo
```
POST /api/v1/todos
```

### Get All Todos
```
GET /api/v1/todos
```

### Get Specific Todo
```
GET /api/v1/todos/{id}
```

### Update Todo
```
PUT /api/v1/todos/{id}
```

### Delete Todo
```
DELETE /api/v1/todos/{id}
```

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost/dbname
   SECRET_KEY=your-secret-key
   ```

3. Run the application:
   ```bash
   uvicorn backend.src.main:app --reload
   ```

## Development

- API documentation available at `/docs` and `/redoc` when running
- Tests can be run with pytest

## JWT Authentication Setup

This backend now includes JWT authentication with the following configuration:

### Required Environment Variables

In addition to the basic setup, you'll need to configure JWT authentication:

```env
DATABASE_URL=postgresql://username:password@localhost/dbname
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30
```

### Generating a JWT Secret Key

To generate a secure JWT secret key, run:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Or using the command line:

```bash
openssl rand -base64 32
```

### Authentication Flow

- All API endpoints (except `/` and `/health`) require a valid JWT token in the `Authorization: Bearer <token>` header
- Tokens are validated using the HS256 algorithm with the shared secret
- User identity is extracted from the `sub` claim in the JWT
- All todo operations are scoped to the authenticated user's ID