'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/auth';

/**
 * Auth Callback Page
 * Redirects to dashboard if authenticated, otherwise to auth page
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Get the current session to verify authentication
        const session = await authService.getSession();

        if (session) {
          // Authentication is confirmed, redirect to dashboard immediately
          router.push('/dashboard');
        } else {
          // No valid session found, redirect to auth
          router.push('/auth');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // On error, redirect to auth page
        router.push('/auth');
      }
    };

    verifyAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-lg text-gray-600">Verifying authentication...</p>
      </div>
    </div>
  );
}