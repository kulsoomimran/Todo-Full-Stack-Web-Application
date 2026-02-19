'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';
import { taskService } from '../../services/task-service';
import TaskList from '../../components/Task/TaskList';
import ChatWindow from '../../components/Chat/ChatWindow';
import DashboardLayout from '../../components/Layout/DashboardLayout';

/**
 * Dashboard Page Component
 * Main hub with sidebar navigation for Todos and AI Agent
 */
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [activeSection, setActiveSection] = useState<'todos' | 'ai-agent'>('todos');

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
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"></div>
          <p className="mt-4 text-lg text-gray-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {/* Content Area */}
      {activeSection === 'todos' ? (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <TaskList
            initialTodos={tasks}
            loading={loadingTasks}
            onTodosChange={setTasks}
          />
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-800" style={{ height: '700px' }}>
          <ChatWindow />
        </div>
      )}
    </DashboardLayout>
  );
}