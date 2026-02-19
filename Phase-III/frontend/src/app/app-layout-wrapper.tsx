'use client';

import { AuthProvider, useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

// Inner layout component that uses auth context
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); // Redirect to main page after signout
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <main>
        {children}
      </main>
    </div>
  );
}