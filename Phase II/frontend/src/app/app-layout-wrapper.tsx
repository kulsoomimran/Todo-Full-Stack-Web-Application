'use client';

import { AuthProvider, useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

// Inner layout component that uses auth context
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth'); // Redirect to auth page after signout
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Premium Navigation Header */}
      <nav className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)', backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                ✓
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>TaskFlow</span>
            </div>
            <div className="flex items-center gap-6">
              {user && (
                <div className="flex items-center gap-4">
                  <span className="text-sm hidden md:block" style={{ color: 'var(--color-muted)' }}>
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:opacity-80"
                    style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(251,113,133,0.08)' }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {children}
      </main>
    </div>
  );
}