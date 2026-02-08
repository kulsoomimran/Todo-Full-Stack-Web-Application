'use client';

import { AuthProvider } from './AuthProvider';
import AppLayout from './app-layout-wrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppLayout>{children}</AppLayout>
    </AuthProvider>
  );
}