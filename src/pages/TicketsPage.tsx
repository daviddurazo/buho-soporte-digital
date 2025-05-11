
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { TechnicianTickets } from '@/components/Tickets/TechnicianTickets';

// Import your ticket components here
// import { StudentTickets } from '@/components/Tickets/StudentTickets';
// import { ProfessorTickets } from '@/components/Tickets/ProfessorTickets';
// import { AdminTickets } from '@/components/Tickets/AdminTickets';

const TicketsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
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

  // Render appropriate ticket component based on user role
  const renderTicketComponentByRole = () => {
    switch (user?.role) {
      case 'technician':
        return <TechnicianTickets />;
      case 'student':
      case 'professor':
      case 'admin':
        // Placeholder until other ticket components are implemented
        return (
          <div className="border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Contenido de Tickets para {user?.role}</h2>
            <p className="text-gray-600">
              Esta es una página de marcador de posición para la gestión de tickets.
              Dependiendo del rol del usuario ({user?.role}), se mostraría una interfaz diferente.
            </p>
          </div>
        );
      default:
        return <div>Acceso no permitido</div>;
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {user?.role === 'admin' && "Gestionar Tickets"}
          {user?.role === 'technician' && "Tickets Asignados"}
          {(user?.role === 'student' || user?.role === 'professor') && "Mis Tickets"}
        </h1>
        
        {renderTicketComponentByRole()}
      </div>
    </AppLayout>
  );
};

export default TicketsPage;
