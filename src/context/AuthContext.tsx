
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Simulated user data for development - in a real app this would come from authentication
  useEffect(() => {
    const loadUser = async () => {
      // For demo purposes, I'll simulate authentication
      // with localStorage to persist between refreshes
      const storedUser = localStorage.getItem('unisonUser');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setAuthState({
            user: parsedUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem('unisonUser');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, we would call an API endpoint
    // For now, we simulate a login with dummy data
    
    // Validate email format (must end with @unison.mx)
    if (!email.endsWith('@unison.mx')) {
      throw new Error('El correo electrónico debe ser de dominio @unison.mx');
    }
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a dummy user based on the email
    let role: UserRole = 'student';
    
    // Determine role based on email prefix for demo purposes
    if (email.includes('admin')) {
      role = 'admin';
    } else if (email.includes('tech')) {
      role = 'technician';
    } else if (email.includes('prof')) {
      role = 'professor';
    }
    
    const user: User = {
      id: `user-${Date.now()}`,
      firstName: email.split('@')[0],
      lastName: 'Demo',
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Store in local storage for persistence
    localStorage.setItem('unisonUser', JSON.stringify(user));
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, role: UserRole) => {
    // Validate email format (must end with @unison.mx)
    if (!email.endsWith('@unison.mx')) {
      throw new Error('El correo electrónico debe ser de dominio @unison.mx');
    }
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Store in local storage for persistence
    localStorage.setItem('unisonUser', JSON.stringify(user));
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('unisonUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const forgotPassword = async (email: string) => {
    // Validate email format (must end with @unison.mx)
    if (!email.endsWith('@unison.mx')) {
      throw new Error('El correo electrónico debe ser de dominio @unison.mx');
    }
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, we would send an email with a reset link
    console.log('Password reset link sent to:', email);
  };

  const resetPassword = async (token: string, password: string) => {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, we would validate the token and update the password
    console.log('Password reset with token:', token);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
