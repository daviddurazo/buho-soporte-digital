
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (user) {
          // Redirigir según el rol del usuario
          switch (user.role) {
            case 'admin':
            case 'technician':
              navigate('/dashboard');
              break;
            case 'student':
            case 'professor':
              navigate('/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/auth');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unison-blue"></div>
    </div>
  );
};

export default Index;
