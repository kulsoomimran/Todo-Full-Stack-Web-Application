'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';
import { taskService } from '../../services/task-service';
import TaskList from '../../components/Task/TaskList';

/**
 * Dashboard Page Component
 * Displays welcome message for authenticated users and redirects if not authenticated
 */
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // If user is not logged in, redirect to auth page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Load tasks when user is authenticated
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Redirect to auth if unauthorized
      if ((error as any).status === 401) {
        router.push('/auth');
      }
    } finally {
      setLoadingTasks(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-muted)' }}>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--color-foreground)' }}>
          Welcome back, {user.email?.split('@')[0] || 'User'}! 👋
        </h1>
        <p className="mt-2 text-lg" style={{ color: 'var(--color-muted)' }}>
          Organize and track all your tasks in one place.
        </p>
      </div>

      <div 
        className="rounded-2xl p-8 shadow-lg"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          border: '1px solid rgba(255,255,255,0.04)'
        }}
      >
        <TaskList
          initialTodos={tasks}
          loading={loadingTasks}
          onTodosChange={setTasks}
        />
      </div>
    </div>
  );
}