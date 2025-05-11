
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ReportsContent } from '@/components/Reports/ReportsContent';

const ReportsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unison-blue"></div>
      </div>
    );
  }
  
  // Only allow admin or technician users to access
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'technician')) {
    return <Navigate to="/" />;
  }
  
  return (
    <AppLayout>
      <ReportsContent />
    </AppLayout>
  );
};

export default ReportsPage;
