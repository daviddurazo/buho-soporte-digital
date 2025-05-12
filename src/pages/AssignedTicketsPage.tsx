
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { AssignedTickets } from '@/components/Tickets/AssignedTickets';

const AssignedTicketsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unison-blue"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user || user.role !== 'technician') {
    return <Navigate to="/auth" />;
  }
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Tickets Asignados</h1>
        <AssignedTickets />
      </div>
    </AppLayout>
  );
};

export default AssignedTicketsPage;
