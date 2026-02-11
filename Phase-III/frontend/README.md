# TaskFlow Frontend

A modern, elegant task management application with a beautiful dark theme design and secure JWT-based authentication.

**TaskFlow** - Organize Your Tasks Effortlessly

A premium, professional task management frontend built with Next.js 16+, offering an intuitive interface for task organization with modern dark theme design inspired by GitHub Dark, Linear, and Vercel.

## Prerequisites

- Node.js 18+
- npm or yarn package manager
- Backend API running (FastAPI server on port 8000)

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Configuration

Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Starts the development server with hot reloading
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for linting errors

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/         # Authentication pages (login, signup, logout)
│   │   ├── api/            # API routes (BFF pattern)
│   │   ├── dashboard/      # Main application area
│   │   ├── layout.tsx      # Root layout with auth guard
│   │   ├── page.tsx        # Home page
│   │   └── providers/      # Context providers (auth, theme, etc.)
│   ├── components/         # Reusable UI components
│   │   ├── Auth/           # Authentication components
│   │   ├── Task/           # Task management components
│   │   ├── UI/             # General UI primitives
│   │   └── Layout/         # Layout components
│   ├── services/           # Business logic and API services
│   │   ├── auth-service.ts # Authentication logic
│   │   └── task-service.ts # Task management logic
│   ├── lib/               # Utility functions
│   │   └── api-client.ts   # API client with JWT handling
│   └── middleware.ts      # Route protection middleware
├── public/                # Static assets
├── styles/                # Global styles
├── tests/                 # Test files
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Features

- **✨ Premium Dark Theme Design**: Beautiful, cohesive dark-themed interface inspired by modern SaaS applications
- **🎯 Task Management**: Create, read, update, and delete tasks with ease
- **🔐 Secure Authentication**: JWT-based authentication using industry best practices
- **📱 Responsive Design**: Mobile-first approach that works seamlessly on all devices
- **🎨 Modern UI Components**: Custom-styled components with consistent design language
- **⚡ Smooth Interactions**: Hover effects, transitions, and loading states for better UX
- **🌙 Dark Theme**: Forced dark mode with semantic color system for consistency
- **📊 Task Visibility**: High-contrast text with proper accessibility standards
- **🔄 Real-time Updates**: Instant feedback on task operations
- **🛡️ User Isolation**: Each user only sees their own tasks

## API Integration

The frontend uses a Backend for Frontend (BFF) pattern to securely communicate with the backend API:

- API routes in `src/app/api/todos/` act as proxy to the backend
- Authentication context is verified in these routes before forwarding requests
- JWT tokens are handled securely via httpOnly cookies

## Testing the Application

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

### 3. Multi-User Isolation
1. Log in as User A and create some tasks
2. Log out and log in as User B
3. Verify that User B cannot see User A's tasks
4. Create tasks as User B
5. Log out and log back in as User A
6. Verify that User A cannot see User B's tasks

## Security Features

- **Route Protection**: Middleware protects all non-public routes
- **User Isolation**: Each user only sees their own data
- **Secure Authentication**: JWT tokens stored in httpOnly cookies
- **Input Validation**: Client-side and server-side validation
- **Error Handling**: Generic error messages to prevent information leakage

## Deployment

### Build the Application

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Design System

### Color Palette
- **Primary Color**: `#6366F1` (Indigo) - Used for primary actions and highlights
- **Success Color**: `#10B981` (Emerald) - Used for success messages and completed tasks
- **Danger Color**: `#FB7185` (Rose) - Used for destructive actions and errors
- **Foreground**: `#FFFFFF` - Main text color
- **Background**: `#0F172A` (Slate-900) - Page background
- **Surface**: `#1E293B` (Slate-800) - Card and component backgrounds
- **Muted**: `#94A3B8` (Slate-400) - Secondary text and disabled states

### Typography
- **Font**: Inter from Google Fonts
- **Headings**: Semibold weight with increased letter spacing for premium feel
- **Body**: Regular weight for optimal readability
- **Code**: Monospace for technical content

### Components
All components use semantic color variables for consistency:
- `--color-foreground`: Primary text color
- `--color-background`: Page background
- `--color-surface`: Card and component backgrounds
- `--color-primary`: Primary action color
- `--color-success`: Success states
- `--color-danger`: Error and destructive states
- `--color-muted`: Secondary text and inactive states
- `--focus-ring`: Focus outline for accessibility

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for backend API calls | `http://localhost:8000` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | URL for Better Auth backend | `http://localhost:8000` |
| `NEXT_PUBLIC_BACKEND_API_URL` | URL for backend API | `http://localhost:8000` |

## Troubleshooting

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