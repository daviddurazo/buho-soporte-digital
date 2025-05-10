
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UnisonLogo } from '@/components/UnisonLogo';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <UnisonLogo size="lg" className="mb-6" />
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">¡Ups! La página que buscas no existe.</p>
      <Button 
        onClick={() => navigate('/')}
        className="bg-unison-blue hover:bg-blue-700"
      >
        Volver al Inicio
      </Button>
    </div>
  );
};

export default NotFound;
