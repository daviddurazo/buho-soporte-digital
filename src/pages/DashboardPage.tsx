
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { StudentDashboard } from '@/components/Dashboard/StudentDashboard';
import { ProfessorDashboard } from '@/components/Dashboard/ProfessorDashboard';
import { TechnicianDashboard } from '@/components/Dashboard/TechnicianDashboard';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import { Navigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
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
  
  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'professor':
        return <ProfessorDashboard />;
      case 'technician':
        return <TechnicianDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Dashboard not available</div>;
    }
  };
  
  return (
    <AppLayout>
      {renderDashboardByRole()}
    </AppLayout>
  );
};

export default DashboardPage;
