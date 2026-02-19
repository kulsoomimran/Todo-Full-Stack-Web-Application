# TaskFlow - Full-Stack Todo Application

A modern, full-stack task management application built for a hackathon project. TaskFlow provides a secure, multi-user todo management system with a beautiful dark-themed interface and robust backend API.

## Project Overview

TaskFlow is a complete web application that allows users to manage their tasks efficiently. Each user has their own isolated workspace, ensuring privacy and data security. The application features JWT-based authentication, real-time task management, and a premium dark-themed UI.

## Technology Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth with JWT
- **Testing**: Jest, Playwright

### Backend
- **Framework**: FastAPI (Python 3.11)
- **ORM**: SQLModel
- **Database**: Neon PostgreSQL (Serverless)
- **Authentication**: JWT tokens
- **API Documentation**: OpenAPI (Swagger)

## Project Structure

```
Full-Stack Todos App/
├── Phase-II/              # Initial implementation phase
│   ├── frontend/          # Next.js frontend application
│   └── backend/           # FastAPI backend API
├── Phase-III/             # Enhanced implementation phase
│   ├── frontend/          # Next.js frontend with improvements
│   └── backend/           # FastAPI backend with enhancements
└── README.md             # This file
```

## Key Features

- **🔐 Secure Authentication**: JWT-based authentication with Better Auth integration
- **✨ Task Management**: Full CRUD operations (Create, Read, Update, Delete)
- **👥 Multi-User Support**: Each user has isolated access to their own tasks
- **🎨 Modern UI**: Premium dark theme inspired by GitHub, Linear, and Vercel
- **📱 Responsive Design**: Mobile-first approach that works on all devices
- **⚡ Real-time Updates**: Instant feedback on all task operations
- **🛡️ Data Security**: User-scoped queries and secure token handling
- **📊 RESTful API**: Well-documented API with OpenAPI specification

## Getting Started

### Prerequisites

- **Node.js**: 18+ (for frontend)
- **Python**: 3.11+ (for backend)
- **PostgreSQL**: Neon serverless database account
- **Package Managers**: npm/yarn (frontend), pip (backend)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Phase-III/backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following variables:
   ```env
   DATABASE_URL=postgresql://username:password@host/database
   JWT_SECRET_KEY=your-secure-jwt-secret-key
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION_MINUTES=30
   ```

4. Generate a secure JWT secret key:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

5. Run database migrations (if applicable):
   ```bash
   alembic upgrade head
   ```

6. Start the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative Docs: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Phase-III/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Authenticate and receive JWT token

### Todos
- `GET /api/v1/todos` - Get all todos for authenticated user
- `POST /api/v1/todos` - Create a new todo
- `GET /api/v1/todos/{id}` - Get a specific todo
- `PUT /api/v1/todos/{id}` - Update a todo
- `DELETE /api/v1/todos/{id}` - Delete a todo

All todo endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

## Authentication Flow

```
User Registration/Login (Frontend)
  ↓
Better Auth creates session
  ↓
JWT token issued
  ↓
Token stored in httpOnly cookies
  ↓
API requests include token in Authorization header
  ↓
Backend verifies token signature
  ↓
User ID extracted from token claims
  ↓
User-scoped data operations
```

## Testing the Application

### 1. User Registration
1. Navigate to `http://localhost:3000`
2. Click "Sign Up" and create a new account
3. Verify successful registration and automatic login

### 2. Task Management
1. Create a new task using the task form
2. View your task list
3. Update task details or status
4. Delete completed tasks

### 3. Multi-User Isolation
1. Create tasks as User A
2. Log out and create a new account (User B)
3. Verify User B cannot see User A's tasks
4. Create tasks as User B
5. Log back in as User A and verify isolation

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Secure password storage with Better Auth
- **User Isolation**: Database-level user scoping
- **CORS Protection**: Configured for frontend domain only
- **Input Validation**: Both client-side and server-side validation
- **SQL Injection Prevention**: Parameterized queries via SQLModel
- **httpOnly Cookies**: Secure token storage

## Development Workflow

This project follows a Spec-Driven Development (SDD) approach:

1. **Specification** - Define requirements
2. **Planning** - Design architecture
3. **Task Breakdown** - Create testable tasks
4. **Implementation** - Build features incrementally
5. **Testing** - Validate functionality
6. **Documentation** - Record decisions and changes

## Project Phases

### Phase-II
Initial implementation with core features:
- Basic authentication setup
- CRUD operations for todos
- User-scoped data access
- Dark theme UI

### Phase-III
Enhanced implementation with improvements:
- Refined authentication flow
- Enhanced error handling
- Improved UI/UX
- Additional security measures
- Performance optimizations

## Troubleshooting

### Backend Issues

**Database Connection Errors**
- Verify `DATABASE_URL` is correctly formatted
- Check Neon database is accessible
- Ensure database credentials are valid

**JWT Token Errors**
- Verify `JWT_SECRET_KEY` is set in `.env`
- Check token expiration settings
- Ensure frontend and backend use same secret

### Frontend Issues

**API Connection Errors**
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Ensure CORS is properly configured

**Authentication Issues**
- Clear browser cookies and try again
- Verify JWT token is being sent in requests
- Check browser console for error messages

## Contributing

This is a hackathon project. For contributions or improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational and hackathon purposes.

## Acknowledgments

- Built with Next.js, FastAPI, and Neon PostgreSQL
- UI inspired by GitHub Dark, Linear, and Vercel design systems
- Authentication powered by Better Auth

---

**Built with ❤️ for Hackathon II**
