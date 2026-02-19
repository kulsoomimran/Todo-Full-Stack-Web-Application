'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

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

  // If user is not authenticated, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // Just render children - the actual layout is handled by DashboardLayout component
  return <>{children}</>;
}
