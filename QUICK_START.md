# TaskFlow - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (Neon)

---

## Backend Setup (3 minutes)

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup Environment
Create `.env` file in backend directory:
```
NEON_DATABASE_URL=postgresql://user:password@host/database
SECRET_KEY=your-secret-key-here
```

### 5. Run Migrations
```bash
alembic upgrade head
```

### 6. Start Backend Server
```bash
python -m uvicorn src.main:app --reload
```

Backend will be at: **http://localhost:8000**

---

## Frontend Setup (2 minutes)

### 1. Navigate to Frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Create `.env.local` file:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

### 4. Start Frontend Server
```bash
npm run dev
```

Frontend will be at: **http://localhost:3000**

---

## Testing the Application

### 1. Open Browser
Navigate to: **http://localhost:3000**

### 2. Create Account
- Click "Sign Up"
- Enter email and password (min 6 characters)
- Click "Create Account"

### 3. Login
- Enter your credentials
- Click "Sign In"

### 4. Create Tasks
- Enter task title
- Add description (optional)
- Click "+ Add Task"

### 5. Manage Tasks
- **Edit**: Click task title to edit
- **Complete**: Check checkbox to mark done
- **Delete**: Click delete icon to remove
- **Sign Out**: Click "Sign Out" in header

---

## Visual Features

### Dark Theme ✅
- Modern dark interface
- High contrast text
- Smooth transitions
- Professional styling

### Components
- **Navigation**: TaskFlow logo with user info
- **Auth Pages**: Beautiful login/signup forms
- **Dashboard**: Welcome message and task list
- **Task List**: Emoji decorations, counter badge
- **Task Items**: Edit mode, completion tracking

---

## API Endpoints

### Authentication
```
POST /api/v1/signup
POST /api/v1/signin
POST /api/v1/logout
```

### Tasks
```
GET    /api/v1/todos          # List all tasks
POST   /api/v1/todos          # Create task
GET    /api/v1/todos/{id}     # Get task
PUT    /api/v1/todos/{id}     # Update task
DELETE /api/v1/todos/{id}     # Delete task
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check database connection
# Verify NEON_DATABASE_URL in .env
```

### Frontend Won't Start
```bash
# Clear cache
rm -rf node_modules .next
npm install

# Check Node version
node --version

# Verify environment variables
cat .env.local
```

### Can't Login
- Verify backend is running (`http://localhost:8000`)
- Check email/password format
- Look for error messages in browser console
- Verify database connection

### Tasks Not Loading
- Ensure you're logged in
- Check browser DevTools Network tab
- Verify JWT token in cookies
- Check backend logs for errors

---

## Project Structure

```
TaskFlow/
├── backend/
│   ├── src/
│   │   ├── api/              # Route handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── core/             # Auth, error handling
│   │   └── main.py           # FastAPI app
│   ├── requirements.txt
│   └── .env                  # Backend config
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   ├── components/       # React components
│   │   ├── services/         # API integration
│   │   └── lib/              # Utilities
│   ├── package.json
│   └── .env.local            # Frontend config
│
├── FULL_DOCUMENTATION.md     # Complete docs
├── IMPLEMENTATION_CHECKLIST.md # Status checklist
└── TASKFLOW_UI_ENHANCEMENT.md  # Design details
```

---

## Key Features

✨ **Modern Dark Theme**
- Premium appearance
- High contrast text
- Smooth animations

🔐 **Secure Authentication**
- JWT tokens
- Password validation
- User isolation

📝 **Task Management**
- Create, edit, delete
- Mark completed
- Real-time updates

📱 **Responsive Design**
- Works on all devices
- Mobile-friendly
- Touch-optimized

🎨 **Professional UI**
- TaskFlow branding
- Consistent styling
- Intuitive navigation

---

## Next Steps

1. ✅ Start backend
2. ✅ Start frontend
3. ✅ Test authentication
4. ✅ Create tasks
5. ✅ Verify styling
6. ✅ Test on mobile
7. 📦 Deploy to production

---

## Support

For issues:
1. Check browser console for errors
2. Check backend logs
3. Verify environment variables
4. See FULL_DOCUMENTATION.md for detailed help

---

## Application Info

- **Name**: TaskFlow - Organize Your Tasks Effortlessly
- **Version**: 1.0.0
- **Frontend**: Next.js 16 + React 18 + Tailwind CSS
- **Backend**: FastAPI + SQLModel + PostgreSQL
- **Theme**: Dark (Modern & Premium)
- **Status**: ✅ Ready for Production

---

**Happy task managing with TaskFlow! 🚀**
