
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { UserCog, Bell, Shield, Key, LogOut } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    department: '',
    position: '',
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    updates: false,
  });
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleSaveProfile = () => {
    toast.success('Perfil actualizado exitosamente');
  };
  
  const handleChangePassword = () => {
    toast.success('El enlace para cambiar contraseña fue enviado a su correo');
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada exitosamente');
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <Button variant="destructive" onClick={handleLogout} className="mt-4 md:mt-0">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar con información básica */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`} />
                  <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground capitalize">
                    {user?.role}
                  </div>
                </div>
                
                <div className="w-full pt-4">
                  <Button variant="outline" className="w-full">
                    Cambiar foto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Contenido principal */}
          <div className="md:col-span-3">
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">
                  <UserCog className="mr-2 h-4 w-4" />
                  Información Personal
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notificaciones
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="mr-2 h-4 w-4" />
                  Seguridad
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tu información de perfil</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          placeholder="(662) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Input 
                          id="department" 
                          name="department" 
                          value={formData.department} 
                          onChange={handleInputChange}
                          placeholder="Ingeniería"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Puesto</Label>
                        <Input 
                          id="position" 
                          name="position" 
                          value={formData.position} 
                          onChange={handleInputChange}
                          placeholder="Profesor"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveProfile}>
                      Guardar Cambios
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de Notificaciones</CardTitle>
                    <CardDescription>Controla qué tipo de notificaciones deseas recibir</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notificaciones por correo</h4>
                          <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo electrónico</p>
                        </div>
                        <Switch 
                          checked={notifications.email} 
                          onCheckedChange={() => handleNotificationChange('email')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notificaciones en el navegador</h4>
                          <p className="text-sm text-muted-foreground">Recibe notificaciones push en el navegador</p>
                        </div>
                        <Switch 
                          checked={notifications.browser} 
                          onCheckedChange={() => handleNotificationChange('browser')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Actualizaciones del sistema</h4>
                          <p className="text-sm text-muted-foreground">Recibe notificaciones sobre actualizaciones</p>
                        </div>
                        <Switch 
                          checked={notifications.updates} 
                          onCheckedChange={() => handleNotificationChange('updates')}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => toast.success('Preferencias de notificación guardadas')}>
                      Guardar Preferencias
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Seguridad de la cuenta</CardTitle>
                    <CardDescription>Administra la seguridad de tu cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Cambiar contraseña</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Te enviaremos un enlace a tu correo electrónico para cambiar tu contraseña
                        </p>
                        <Button onClick={handleChangePassword} variant="outline" className="flex items-center">
                          <Key className="mr-2 h-4 w-4" />
                          Solicitar cambio de contraseña
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Sesión actual</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Iniciaste sesión el {new Date().toLocaleString()}
                        </p>
                        <Button onClick={handleLogout} variant="destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          Cerrar sesión en todos los dispositivos
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
