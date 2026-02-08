# TaskFlow - Full-Stack Application Documentation

## Project Overview

**TaskFlow** is a modern, premium task management application with:
- Secure JWT-based authentication
- User-scoped task management
- Beautiful dark theme design
- Production-ready infrastructure

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: SQLModel
- **Authentication**: JWT with HS256
- **Error Handling**: Comprehensive logging and structured error responses

### Frontend
- **Framework**: Next.js 16+ with React 18
- **Styling**: Tailwind CSS 3.4.19
- **Authentication**: JWT tokens via httpOnly cookies
- **Design**: Modern dark theme with semantic color system

## Architecture

### Backend Structure
```
backend/
├── src/
│   ├── main.py              # FastAPI application setup
│   ├── api/                 # API route handlers
│   │   ├── auth_router.py   # Authentication endpoints
│   │   └── todo_router.py   # Task management endpoints
│   ├── services/            # Business logic
│   │   └── todo_service.py  # Task operations
│   ├── models/              # SQLModel ORM models
│   │   ├── todo_model.py    # Task model with schema
│   │   └── user_model.py    # User model
│   ├── database/            # Database configuration
│   │   └── database.py      # SQLAlchemy engine setup
│   ├── core/                # Core utilities
│   │   ├── auth.py          # JWT authentication logic
│   │   └── error_handler.py # Error handling
│   └── schemas/             # Pydantic schemas
│       └── todo_schema.py   # Task validation schemas
├── tests/                   # Test suite
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
└── requirements.txt         # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                 # Next.js app routes
│   │   ├── (auth)/         # Authentication pages
│   │   ├── dashboard/      # Main application area
│   │   ├── api/            # API routes (BFF pattern)
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles & dark theme
│   ├── components/         # Reusable components
│   │   ├── Task/          # Task management components
│   │   └── UI/            # UI primitives
│   ├── services/           # API integration
│   │   ├── auth.ts        # Authentication service
│   │   └── task-service.ts # Task management service
│   └── lib/               # Utilities
│       └── api-client.ts  # HTTP client
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/v1/signup` - Create new user account
- `POST /api/v1/signin` - Authenticate and get JWT token
- `POST /api/v1/logout` - Invalidate session

### Task Management
- `GET /api/v1/todos` - List user's tasks
- `POST /api/v1/todos` - Create new task
- `GET /api/v1/todos/{id}` - Get task details
- `PUT /api/v1/todos/{id}` - Update task
- `DELETE /api/v1/todos/{id}` - Delete task

## Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #6366F1 | Primary actions, highlights |
| Success | #10B981 | Success states, completed tasks |
| Danger | #FB7185 | Errors, destructive actions |
| Foreground | #FFFFFF | Primary text |
| Background | #0F172A | Page background |
| Surface | #1E293B | Cards, components |
| Muted | #94A3B8 | Secondary text |

### CSS Variables
```css
--color-foreground: #FFFFFF;
--color-background: #0F172A;
--color-surface: #1E293B;
--color-primary: #6366F1;
--color-success: #10B981;
--color-danger: #FB7185;
--color-muted: #94A3B8;
--focus-ring: 3px;
```

## Features

### User Management
- ✅ Secure signup with password validation
- ✅ Secure login with JWT authentication
- ✅ Logout with session invalidation
- ✅ User-scoped data isolation

### Task Management
- ✅ Create tasks with title and description
- ✅ View all user tasks
- ✅ Edit task details
- ✅ Mark tasks as completed
- ✅ Delete tasks
- ✅ Real-time task updates

### User Experience
- ✅ Beautiful dark theme interface
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations and transitions
- ✅ Loading states and progress indicators
- ✅ Comprehensive error messages
- ✅ Form validation with feedback

### Security
- ✅ JWT-based authentication
- ✅ HttpOnly cookies for token storage
- ✅ CORS protection
- ✅ Input validation (client & server)
- ✅ User data isolation
- ✅ Secure password handling

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (Neon cloud account)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with database credentials
# NEON_DATABASE_URL=postgresql://...

# Run database migrations
alembic upgrade head

# Start server
python -m uvicorn src.main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
EOF

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing the Application

### Manual Testing Checklist

#### 1. Authentication Flow
- [ ] Navigate to http://localhost:3000
- [ ] Click "Sign Up" to create new account
- [ ] Verify form validation works
- [ ] Create account successfully
- [ ] Log in with created credentials
- [ ] Verify dashboard loads
- [ ] Test password visibility toggle
- [ ] Test sign out

#### 2. Task Management
- [ ] Create a new task with title and description
- [ ] Verify task appears in list
- [ ] Edit task and verify changes
- [ ] Mark task as completed
- [ ] Verify strikethrough styling
- [ ] Delete task and verify removal
- [ ] Create multiple tasks
- [ ] Verify task counter updates

#### 3. Dark Theme
- [ ] Verify all backgrounds are dark
- [ ] Confirm text is clearly visible
- [ ] Check hover effects work
- [ ] Verify focus states visible
- [ ] Test on mobile screen

#### 4. Error Handling
- [ ] Try invalid login credentials
- [ ] Verify error message appears
- [ ] Create task with empty title
- [ ] Check validation message
- [ ] Sign out and try accessing dashboard
- [ ] Verify redirect to login

#### 5. Multi-User Isolation
- [ ] Create task as User A
- [ ] Log out and log in as User B
- [ ] Verify User B doesn't see User A's tasks
- [ ] Create task as User B
- [ ] Switch back to User A
- [ ] Verify User A doesn't see User B's tasks

### API Testing

Test endpoints using curl or Postman:

```bash
# Signup
curl -X POST http://localhost:8000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Signin
curl -X POST http://localhost:8000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Create Todo (with JWT token)
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'

# Get Todos
curl -X GET http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Users Table
```sql
CREATE TABLE "user" (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table
```sql
CREATE TABLE todo (
  id UUID PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES "user"(id),
  title VARCHAR NOT NULL,
  description VARCHAR,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

### Backend (.env)
```
NEON_DATABASE_URL=postgresql://user:password@host/database
SECRET_KEY=your-secret-key-for-jwt
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

## Troubleshooting

### Backend Issues

**Error: "Unable to connect to database"**
- Verify Neon credentials in .env
- Check database URL format
- Ensure PostgreSQL is accessible

**Error: "JWT token invalid"**
- Verify SECRET_KEY matches between requests
- Check token expiration
- Ensure token is in Authorization header

### Frontend Issues

**Error: "Unauthorized" on API calls**
- Verify token is stored in cookies
- Check Authorization header is sent
- Confirm backend is running

**Error: "Cannot find module"**
- Run `npm install` to install dependencies
- Clear node_modules and reinstall if needed

**Dark theme not applied**
- Check globals.css is imported in layout.tsx
- Verify CSS variables are defined
- Check browser DevTools for CSS errors

## Performance Optimization

### Backend
- Database indexing on frequently queried columns
- Connection pooling with SQLAlchemy
- Request validation at entry point
- Efficient error handling

### Frontend
- Code splitting with Next.js
- Image optimization
- CSS-in-JS with Tailwind
- Lazy loading of components
- Optimized re-renders with React hooks

## Security Best Practices

- ✅ Input validation on client and server
- ✅ JWT tokens in httpOnly cookies
- ✅ CORS configuration for trusted origins
- ✅ Password hashing with bcrypt
- ✅ Error messages don't leak sensitive info
- ✅ Rate limiting on auth endpoints (recommended)
- ✅ HTTPS in production (required)

## Deployment

### Backend Deployment
1. Set environment variables on host
2. Run database migrations: `alembic upgrade head`
3. Start server: `gunicorn src.main:app`
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificates

### Frontend Deployment
1. Build: `npm run build`
2. Set environment variables
3. Start: `npm start`
4. Configure reverse proxy
5. Set up SSL certificates

## Monitoring & Logging

### Backend
- Structured logging with Python logging module
- Error tracking with exc_info=True
- Request/response logging
- Database query logging

### Frontend
- Browser console for client-side errors
- Network tab for API debugging
- Performance monitoring
- Error boundary components

## Future Enhancements

- [ ] Task categories/tags
- [ ] Task priority levels
- [ ] Recurring tasks
- [ ] Task due dates and reminders
- [ ] Subtasks
- [ ] Task sharing between users
- [ ] Dark/light theme toggle
- [ ] Mobile app
- [ ] Email notifications
- [ ] Task templates

## Support & Maintenance

For issues or questions:
1. Check troubleshooting section
2. Review error logs
3. Check API documentation
4. Review code comments

## License

This project is part of the Hackathon II competition.

---

**Project Status**: ✅ Complete and Ready for Testing

**Last Updated**: 2024
**Version**: 1.0.0
**Theme**: Dark (Forced Global)
**Application Name**: TaskFlow - Organize Your Tasks Effortlessly
