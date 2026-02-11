'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

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
            {/* Outer ring */}
            <div 
              className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
              style={{ 
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderTopColor: 'transparent'
              }}
            />
            {/* Inner ring */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-b-transparent animate-spin"
              style={{ 
                borderColor: 'transparent',
                borderBottomColor: 'var(--color-primary)',
                animationDirection: 'reverse',
                animationDuration: '1s'
              }}
            />
            {/* Center dot */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          </div>
          
          <div className="mt-6 space-y-2">
            <p className="text-lg font-semibold text-white">Loading</p>
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

  // If user is authenticated, don't render the auth layout
  if (user) {
    return null;
  }

  return <>{children}</>;
}