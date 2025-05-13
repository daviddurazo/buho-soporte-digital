
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { User as AppUser, UserRole } from '@/types';

interface AuthContextProps {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  // Add these methods to fix the TypeScript errors
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, role: UserRole) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  // Add default implementations for the new methods
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  forgotPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For the demo, we'll use a simulated auth flow since we don't have real auth set up yet
    const loadUserFromLocalStorage = () => {
      // Try to get mock user from localStorage
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Ensure the role is a valid UserRole type
        if (typeof parsedUser.role === 'string' && ['student', 'professor', 'technician', 'admin'].includes(parsedUser.role)) {
          setUser(parsedUser as AppUser);
        } else {
          console.error('Invalid user role in stored user data');
        }
        setIsLoading(false);
      } else {
        // For testing, we'll auto-create a technician user
        const mockTechnician: AppUser = {
          id: 'd7bed81c-d803-41a5-803f-128c79fb3a7d',
          firstName: 'Carlos',
          lastName: 'Mendoza',
          email: 'carlos.mendoza@unison.mx',
          role: 'technician',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('mockUser', JSON.stringify(mockTechnician));
        setUser(mockTechnician);
        setIsLoading(false);
      }
    };

    loadUserFromLocalStorage();

    // Listen for real auth changes if we implement that later
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // In a real implementation, you would fetch the user profile here
          // For now we'll just use our mock user
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, you'd use supabase.auth.signInWithPassword here
      // For now, we'll simulate a successful login
      
      // Find the correct mock user based on the role in the email
      let mockUser: AppUser | null = null;
      
      if (email.includes('student')) {
        mockUser = {
          id: 'e892094c-7f4a-4f93-a10c-9b271f53dbd0',
          firstName: 'Maria',
          lastName: 'Rodriguez',
          email: 'maria.rodriguez@unison.mx',
          role: 'student',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (email.includes('professor')) {
        mockUser = {
          id: 'f456e321-a22c-4521-9013-430598db2fde',
          firstName: 'Juan',
          lastName: 'Garcia',
          email: 'juan.garcia@unison.mx',
          role: 'professor',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (email.includes('technician')) {
        mockUser = {
          id: 'd7bed81c-d803-41a5-803f-128c79fb3a7d',
          firstName: 'Carlos',
          lastName: 'Mendoza',
          email: 'carlos.mendoza@unison.mx',
          role: 'technician',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (email.includes('admin')) {
        mockUser = {
          id: 'a123b456-c789-4d56-e789-012345678abc',
          firstName: 'Ana',
          lastName: 'Martinez',
          email: 'ana.martinez@unison.mx',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Default to technician
        mockUser = {
          id: 'd7bed81c-d803-41a5-803f-128c79fb3a7d',
          firstName: 'Carlos',
          lastName: 'Mendoza',
          email: 'carlos.mendoza@unison.mx',
          role: 'technician',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // In a real app, you'd use supabase.auth.signUp here
      // For now, we'll simulate a successful signup
      const mockUser: AppUser = {
        id: crypto.randomUUID(),
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'User',
        email: email,
        role: userData.role || 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // In a real app, you'd use supabase.auth.signOut here
      localStorage.removeItem('mockUser');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Implement the missing methods to fix TypeScript errors
  const login = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) throw error;
  };

  const logout = async () => {
    await signOut();
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, role: UserRole) => {
    const userData = { firstName, lastName, role };
    const { error } = await signUp(email, password, userData);
    if (error) throw error;
  };

  const forgotPassword = async (email: string) => {
    try {
      // In a real app, you'd use supabase.auth.resetPasswordForEmail here
      // For now, we'll just simulate sending a reset link
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        login,
        logout,
        register,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
