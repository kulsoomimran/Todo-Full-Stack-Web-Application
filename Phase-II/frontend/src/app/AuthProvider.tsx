'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/auth';

// Define the shape of our auth context
interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const userData = await authService.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Set up interval to refresh session periodically
    const interval = setInterval(loadSession, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear the local state even if backend sign out fails
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const userData = await authService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signOut,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}