'use client';

import { useState } from 'react';
import { taskService, Task } from '../../services/task-service';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';
import EmptyState from '../UI/EmptyState';

interface TaskListProps {
  initialTodos: Task[];
  loading: boolean;
  onTodosChange: (todos: Task[]) => void;
}

export default function TaskList({ initialTodos, loading, onTodosChange }: TaskListProps) {
  const [todos, setTodos] = useState<Task[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTask = async () => {
    if (!newTodo.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const newTaskItem = await taskService.createTask({
        title: newTodo,
        description: newDescription || undefined,
      });

      setTodos([newTaskItem, ...todos]);
      onTodosChange([newTaskItem, ...todos]);

      setNewTodo('');
      setNewDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (id: number) => {
    const task = todos.find(t => t.id === id);
    if (!task) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.toggleTaskCompletion(id);

      const updatedTasks = todos.map(t =>
        t.id === id ? updatedTask : t
      );

      setTodos(updatedTasks);
      onTodosChange(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);

      const updatedTasks = todos.filter(t => t.id !== id);
      setTodos(updatedTasks);
      onTodosChange(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} />
      )}

      {/* Add Task Form - Enhanced */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)', paddingBottom: '2rem' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
          ✨ Add a New Task
        </h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="shadow-sm block w-full sm:max-w-lg sm:text-sm rounded-lg p-3 focus:ring-2 focus:ring-offset-0 transition-all"
              style={{ 
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                border: '1px solid rgba(255,255,255,0.08)',
                focusRing: 'var(--color-primary)'
              }}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
          </div>
          <div>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add details (optional)"
              className="shadow-sm block w-full sm:max-w-lg sm:text-sm rounded-lg p-3 focus:ring-2 focus:ring-offset-0 transition-all"
              style={{ 
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              rows={2}
            />
          </div>
          <button
            onClick={addTask}
            disabled={isLoading || !newTodo.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ 
              backgroundColor: isLoading || !newTodo.trim() ? '#9ca3af' : 'var(--color-primary)',
              cursor: isLoading || !newTodo.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Adding...' : '+ Add Task'}
          </button>
        </div>
      </div>

      {/* Task List - Enhanced */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-foreground)' }}>
          <span>📋 Your Tasks</span>
          <span className="px-2 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)' }}>
            {todos.length}
          </span>
        </h2>

        {todos.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task and start organizing!"
          />
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="rounded-lg p-4 flex justify-between items-start transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}
              >
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTask(todo.id)}
                    className="h-5 w-5 rounded mt-0.5 cursor-pointer accent-indigo-600 flex-shrink-0"
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium transition-all ${
                        todo.completed ? 'line-through opacity-60' : ''
                      }`}
                      style={{ color: todo.completed ? 'var(--color-muted)' : 'var(--color-foreground)' }}
                    >
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="text-sm mt-1 break-words" style={{ color: 'var(--color-muted)' }}>
                        {todo.description}
                      </p>
                    )}
                    <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {new Date(todo.created_at).toLocaleDateString()} at {new Date(todo.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(todo.id)}
                  className="text-sm font-medium px-3 py-1 rounded ml-2 transition-colors hover:opacity-75 flex-shrink-0"
                  style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(251,113,133,0.08)' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}