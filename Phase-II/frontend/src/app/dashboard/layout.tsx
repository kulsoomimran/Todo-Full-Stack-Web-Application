'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ 
              background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />
        </div>

        {/* Loading spinner */}
        <div className="text-center relative z-10">
          <div className="relative inline-block">
            <div 
              className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
              style={{ 
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderTopColor: 'transparent'
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-b-transparent animate-spin"
              style={{ 
                borderColor: 'transparent',
                borderBottomColor: 'var(--color-primary)',
                animationDirection: 'reverse',
                animationDuration: '1s'
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          </div>
          
          <div className="mt-6 space-y-2">
            <p className="text-lg font-semibold text-white">Loading Dashboard</p>
            <div className="flex items-center justify-center gap-1">
              <div 
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  animationDelay: '0ms'
                }}
              />
              <div 
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  animationDelay: '150ms'
                }}
              />
              <div 
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  animationDelay: '300ms'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, don't render the dashboard layout
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)'
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">TaskFlow</h1>
                <p className="text-xs text-gray-400">Todo Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="font-medium" style={{ color: 'var(--color-primary)' }}>My Tasks</span>
            </button>

            {/* <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Analytics</span>
              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">Soon</span>
            </button> */}

            {/* <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Settings</span>
            </button> */}
          </nav>

          {/* User Profile & Sign Out */}
          <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
            <div 
              className="px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">Free Plan</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header 
          className="sticky top-0 z-30 backdrop-blur-lg"
          style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex-1 lg:flex-none">
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                  title="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}