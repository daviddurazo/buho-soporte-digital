
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Bell, Menu, X } from 'lucide-react';
import { UnisonLogo } from './UnisonLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada exitosamente");
  };

  const getNavLinksByRole = () => {
    switch (user?.role) {
      case 'student':
        return [
          { label: 'Dashboard', href: '/' },
          { label: 'Mis Tickets', href: '/tickets' },
          { label: 'Nuevo Ticket', href: '/tickets/new' },
        ];
      case 'professor':
        return [
          { label: 'Dashboard', href: '/' },
          { label: 'Mis Tickets', href: '/tickets' },
          { label: 'Nuevo Ticket', href: '/tickets/new' },
          { label: 'Horarios', href: '/schedule' },
        ];
      case 'technician':
        return [
          { label: 'Dashboard', href: '/' },
          { label: 'Tickets Asignados', href: '/tickets/assigned' },
          { label: 'Todos los Tickets', href: '/tickets' },
          { label: 'Reportes', href: '/reports' },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', href: '/' },
          { label: 'Gestionar Tickets', href: '/tickets' },
          { label: 'Gestionar Usuarios', href: '/users' },
          { label: 'Configuración', href: '/config' },
          { label: 'Reportes', href: '/reports' },
        ];
      default:
        return [
          { label: 'Dashboard', href: '/' },
          { label: 'Tickets', href: '/tickets' },
        ];
    }
  };

  const navLinks = getNavLinksByRole();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-unison-blue text-white shadow-md z-10">
        <div className="container mx-auto px-4 flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-blue-800 md:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <a href="/" className="flex items-center space-x-2">
              <UnisonLogo size="sm" className="bg-white rounded-full p-1" />
              <span className="font-bold text-lg hidden sm:inline">Soporte Digital</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-blue-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-blue-800 flex items-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">{user?.firstName} {user?.lastName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/config"}>
                  Configuraciones
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <UnisonLogo size="sm" />
            <span className="font-bold">Soporte Digital</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.href}
              className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium"
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      
      {/* Desktop sidebar and main content */}
      <div className="flex flex-1">
        <nav className="hidden md:block w-64 bg-white p-4 border-r min-h-screen overflow-y-auto">
          <div className="space-y-2">
            {navLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href}
                className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
