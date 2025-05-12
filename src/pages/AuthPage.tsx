
import React, { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

type AuthMode = 'login' | 'register' | 'forgot-password';

// Define interfaces for component props to ensure type safety
interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

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
        
        {mode === 'login' && (
          <div className="mt-4 text-center space-y-2">
            <button 
              className="text-white hover:underline text-sm" 
              onClick={() => setMode('register')}
            >
              ¿No tienes una cuenta? Regístrate
            </button>
            <br />
            <button 
              className="text-white hover:underline text-sm" 
              onClick={() => setMode('forgot-password')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}
        
        {(mode === 'register' || mode === 'forgot-password') && (
          <div className="mt-4 text-center">
            <button 
              className="text-white hover:underline text-sm" 
              onClick={() => setMode('login')}
            >
              Volver al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
