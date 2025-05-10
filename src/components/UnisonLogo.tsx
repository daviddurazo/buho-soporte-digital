
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UnisonLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="https://identidadbuho.unison.mx/wp-content/uploads/2024/03/ESCUDOCOLOR.jpg" 
        alt="Universidad de Sonora" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};
