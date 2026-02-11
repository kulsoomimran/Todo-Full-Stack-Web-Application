# Data Model: Todo Backend Core & Data Layer

## Entity: Todo Task

### Fields
- **id** (UUID/Integer): Primary key, unique identifier for the task
- **title** (String, required): The task title/description (max 255 chars)
- **description** (String, optional): Detailed description of the task (max 1000 chars)
- **completed** (Boolean): Whether the task is completed (default: False)
- **created_at** (DateTime): Timestamp when the task was created (auto-generated)
- **updated_at** (DateTime): Timestamp when the task was last updated (auto-generated)
- **user_id** (String/UUID): Foreign key linking to the user who owns the task

### Relationships
- **Belongs to**: User (one user can have many tasks)
- **Constraints**:
  - Title is required
  - user_id is required for user scoping
  - Task cannot belong to multiple users

### Validation Rules
- Title must not be empty
- Title must be less than 255 characters
- user_id must exist and be valid
- Only the user who owns the task can modify it

## Entity: User (Referenced)

### Fields (for reference)
- **user_id** (String/UUID): Unique identifier for the user
- **Associated tasks**: Collection of Todo Task entities

### Relationships
- **Has many**: Todo Tasks (one user can own multiple tasks)
- **Constraints**: Each task is owned by exactly one user

## State Transitions

### Task State Transitions
- **Created**: New task with completed=False
- **Updated**: Task details changed (title, description, completed status)
- **Completed**: completed=True
- **Deleted**: Task removed from database

### Access Control States
- **Owned**: User can access, modify, and delete the task
- **Not Owned**: User cannot access the task (returns 404)
- **Unauthorized**: User not authenticated (returns 401)

## Database Schema

### Tasks Table
```
Table: tasks
- id: INTEGER PRIMARY KEY AUTO_INCREMENT (or UUID)
- title: VARCHAR(255) NOT NULL
- description: TEXT (optional)
- completed: BOOLEAN DEFAULT FALSE
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- user_id: VARCHAR(255) NOT NULL
```

### Indexes
- Index on user_id for efficient user-scoped queries
- Index on (user_id, completed) for filtered queries
- Index on created_at for chronological sorting

## Data Flow

### Creation Flow
1. User sends POST request with task data
2. Backend validates user authentication (deferred to Spec-2)
3. Backend verifies user_id matches authenticated user
4. Task is saved with user_id association
5. Created task is returned with 201 status

### Retrieval Flow
1. User sends GET request for tasks
2. Backend authenticates user (deferred to Spec-2)
3. Backend queries tasks filtered by user_id
4. Only tasks belonging to user are returned
5. Response includes array of user's tasks

### Modification Flow
1. User sends PUT/PATCH request for specific task
2. Backend authenticates user (deferred to Spec-2)
3. Backend verifies task belongs to user (via user_id match)
4. Task is updated if ownership verified
5. Updated task is returned with 200 status

### Deletion Flow
1. User sends DELETE request for specific task
2. Backend authenticates user (deferred to Spec-2)
3. Backend verifies task belongs to user (via user_id match)
4. Task is deleted if ownership verified
5. Empty response returned with 204 status