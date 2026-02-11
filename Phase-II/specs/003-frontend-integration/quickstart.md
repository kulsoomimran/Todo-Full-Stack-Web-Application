# Quickstart Guide: Frontend & Integration

**Date**: 2026-01-09
**Feature**: Frontend & Integration
**Phase**: 1 (Design)

## Overview
This guide explains how to set up and run the frontend application that integrates with the backend API for the Todo application.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (FastAPI server)
- Valid JWT token for authentication

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Environment Configuration
Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXTAUTH_SECRET=your-secret-key-here
```

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Running in Production Mode

### 1. Build the Application
```bash
npm run build
# or
yarn build
```

### 2. Start the Production Server
```bash
npm start
# or
yarn start
```

## Testing the Integration

### 1. Authentication Flow
1. Navigate to the application homepage
2. You should be redirected to the login page if not authenticated
3. Use the sign up form to create an account
4. Verify that you can log in with your credentials

### 2. Task Management
1. Once logged in, navigate to the dashboard
2. Create a new task using the task creation form
3. Verify that the task appears in your task list
4. Update a task and verify the changes are saved
5. Delete a task and verify it's removed from the list

### 3. API Integration
1. Open browser developer tools
2. Navigate to the Network tab
3. Perform task operations
4. Verify that API requests include the Authorization header with JWT token
5. Check that responses are received successfully

### 4. Multi-User Isolation
1. Log in as User A and create some tasks
2. Log out and log in as User B
3. Verify that User B cannot see User A's tasks
4. Create tasks as User B
5. Log out and log back in as User A
6. Verify that User A cannot see User B's tasks

## Common Issues and Solutions

### Issue: "Unauthorized" Errors
**Solution**:
- Verify that the JWT token is properly stored in cookies
- Check that the Authorization header is being sent with API requests
- Confirm that the backend API is running and accessible

### Issue: "Network Error" When Calling API
**Solution**:
- Check that the `NEXT_PUBLIC_API_BASE_URL` is correctly set
- Verify that the backend server is running
- Ensure the correct port and protocol are used

### Issue: "Page Not Found" for Protected Routes
**Solution**:
- Verify that the authentication middleware is properly configured
- Check that the user is properly authenticated before accessing protected routes
- Confirm that the session cookie is being sent with requests

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for backend API calls | `http://localhost:8000` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | URL for Better Auth backend | `http://localhost:8000` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | `your-secret-key-here` |

## API Integration Points

### Next.js API Routes
The frontend implements BFF (Backend for Frontend) pattern through these routes:
- `frontend/src/app/api/todos/route.ts` - Handles todo CRUD operations
- `frontend/src/app/api/todos/[id]/route.ts` - Handles specific todo operations

### Authentication Service
- `frontend/src/services/auth.ts` - Manages authentication state and API calls
- Uses Better Auth client SDK for authentication flows

### API Client
- `frontend/src/lib/api-client.ts` - Centralized API client with JWT handling
- Automatically attaches JWT tokens to backend requests

## Deployment Notes

### Build Optimization
- The application is optimized for production builds
- Assets are minified and bundled
- Code splitting is implemented for better loading performance

### Environment Configuration
- Ensure environment variables are set correctly in the deployment environment
- Use secure secrets for production deployments
- Configure CORS settings to match the deployed frontend URL

## Next Steps

1. Customize the UI components to match your design requirements
2. Add additional validation and error handling as needed
3. Implement additional user features beyond the basic task management
4. Add comprehensive tests for all components and integration points
5. Set up monitoring and logging for production environments

---

**Status**: Ready for development - All setup steps documented and verified.