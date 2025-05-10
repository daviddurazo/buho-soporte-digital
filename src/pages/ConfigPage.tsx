
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import ConfigurationPanel from "@/components/Configuration/ConfigurationPanel";

const ConfigPage = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unison-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return <ConfigurationPanel />;
};

export default ConfigPage;
