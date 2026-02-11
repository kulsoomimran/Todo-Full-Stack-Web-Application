'use client';

import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

/**
 * Root Page Component
 * Shows loading state until auth is determined, then renders appropriate content
 */
export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not authenticated, redirect to auth
        router.push('/auth');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12" style={{
          borderColor: 'rgba(255,255,255,0.2)',
          borderTopColor: 'var(--color-primary)',
          borderWidth: '3px'
        }}></div>
        <p className="mt-4 text-lg" style={{ color: 'var(--color-muted)' }}>Loading TaskFlow...</p>
      </div>
    </div>
  );
}