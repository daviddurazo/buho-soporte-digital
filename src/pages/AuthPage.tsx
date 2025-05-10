
import React, { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

type AuthMode = 'login' | 'register' | 'forgot-password';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unison-blue"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-unison-blue to-blue-900 p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm 
            onSwitchToRegister={() => setMode('register')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
          />
        )}
        
        {mode === 'register' && (
          <RegisterForm 
            onSwitchToLogin={() => setMode('login')}
          />
        )}
        
        {mode === 'forgot-password' && (
          <ForgotPasswordForm 
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
