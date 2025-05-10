
import React from 'react';
import AppLayout from '@/components/AppLayout';
import TicketForm from '@/components/TicketForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const NewTicketPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unison-blue"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Nuevo Ticket</h2>
          <p className="text-muted-foreground">
            Complete el siguiente formulario para reportar un problema técnico
          </p>
        </div>
        
        <TicketForm />
      </div>
    </AppLayout>
  );
};

export default NewTicketPage;
