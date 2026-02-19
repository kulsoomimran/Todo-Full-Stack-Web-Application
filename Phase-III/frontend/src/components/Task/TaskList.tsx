'use client';

import { useState, useEffect } from 'react';
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
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Sync local state with parent's initialTodos prop
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

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

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - Refined */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Tasks</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Add Task Form - Refined */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <h2 className="text-xl font-bold text-white">Create New Task</h2>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addTask()}
            />
          </div>
          <div>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add details (optional)"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={2}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {newTodo.length > 0 && `${newTodo.length} characters`}
            </span>
            <button
              onClick={addTask}
              disabled={isLoading || !newTodo.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add Task'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs - Refined */}
      <div className="flex items-center gap-2 bg-gray-800/30 rounded-xl p-1.5 border border-gray-700/50">
        {(['all', 'active', 'completed'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              filter === filterOption
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            <span className="ml-2 text-xs opacity-75">
              ({filterOption === 'all' ? stats.total : filterOption === 'active' ? stats.active : stats.completed})
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div>
        {filteredTodos.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">
                {filter === 'completed' ? '🎉' : filter === 'active' ? '📝' : '📋'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {filter === 'completed' ? 'No completed tasks yet' : filter === 'active' ? 'No active tasks' : 'No tasks yet'}
            </h3>
            <p className="text-gray-400 text-sm">
              {filter === 'all' ? 'Create your first task to get started!' : `Switch to "All" to see your tasks`}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTodos.map((todo, index) => (
              <li
                key={todo.id}
                className="group bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70 transition-all animate-fadeIn"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Enhanced Checkbox */}
                  <div className="flex-shrink-0 mt-1">
                    <label className="relative flex items-center justify-center cursor-pointer group/checkbox">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTask(todo.id)}
                        className="sr-only peer"
                      />
                      <div className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        todo.completed
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 shadow-lg shadow-green-500/30'
                          : 'bg-gray-900 border-gray-600 group-hover/checkbox:border-blue-500 group-hover/checkbox:shadow-lg group-hover/checkbox:shadow-blue-500/20'
                      }`}>
                        {todo.completed && (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base font-semibold transition-all ${
                        todo.completed
                          ? 'line-through text-gray-500'
                          : 'text-white'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-gray-400 mt-2 break-words leading-relaxed">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(todo.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {todo.completed && (
                        <span className="px-2.5 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs font-semibold border border-green-500/20">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(todo.id)}
                    className="flex-shrink-0 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}