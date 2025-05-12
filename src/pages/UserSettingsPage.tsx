import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaintbrushIcon, BellIcon, Languages, Eye, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const UserSettingsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    darkMode: theme === 'dark',
    fontSize: 'medium',
    language: 'es',
    highContrast: false,
    notifications: {
      email: true,
      browser: true,
      sound: true,
      updates: false,
      tickets: true
    }
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
  
  const handleToggleSettings = (key: keyof typeof settings, nestedKey?: string) => {
    if (nestedKey) {
      setSettings(prev => ({
        ...prev,
        [key]: {
          ...prev[key as keyof typeof prev],
          [nestedKey]: !prev[key as keyof typeof prev][nestedKey as keyof typeof prev[keyof typeof prev]]
        }
      }));
    } else {
      // @ts-ignore - Dynamic handling for boolean properties
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
      
      // Manejar cambio de tema
      if (key === 'darkMode') {
        setTheme(!settings.darkMode ? 'dark' : 'light');
      }
    }
  };
  
  const handleSelectChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveSettings = () => {
    toast.success('Configuración guardada exitosamente');
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        
        <Tabs defaultValue="appearance">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">
              <PaintbrushIcon className="mr-2 h-4 w-4" />
              Apariencia
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellIcon className="mr-2 h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="language">
              <Languages className="mr-2 h-4 w-4" />
              Idioma y Región
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Eye className="mr-2 h-4 w-4" />
              Accesibilidad
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>Personaliza la apariencia de la interfaz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Modo oscuro</Label>
                    <p className="text-sm text-muted-foreground">Cambia entre tema claro y oscuro</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <Switch 
                      checked={settings.darkMode} 
                      onCheckedChange={() => handleToggleSettings('darkMode')}
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tamaño de fuente</Label>
                  <Select 
                    value={settings.fontSize} 
                    onValueChange={(value) => handleSelectChange('fontSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tamaño de fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Configura tus preferencias de notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones por correo</Label>
                    <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo electrónico</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.email} 
                    onCheckedChange={() => handleToggleSettings('notifications', 'email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones del navegador</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones push en el navegador</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.browser} 
                    onCheckedChange={() => handleToggleSettings('notifications', 'browser')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Sonidos de notificación</Label>
                    <p className="text-sm text-muted-foreground">Reproduce sonidos al recibir notificaciones</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.sound} 
                    onCheckedChange={() => handleToggleSettings('notifications', 'sound')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Actualizaciones del sistema</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones sobre actualizaciones</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.updates} 
                    onCheckedChange={() => handleToggleSettings('notifications', 'updates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones de tickets</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones sobre cambios en tickets</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.tickets} 
                    onCheckedChange={() => handleToggleSettings('notifications', 'tickets')}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Idioma y Región</CardTitle>
                <CardDescription>Configura el idioma y la región de la aplicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => handleSelectChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Accesibilidad</CardTitle>
                <CardDescription>Configura opciones de accesibilidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Alto contraste</Label>
                    <p className="text-sm text-muted-foreground">Mejora la visibilidad de texto y elementos</p>
                  </div>
                  <Switch 
                    checked={settings.highContrast} 
                    onCheckedChange={() => handleToggleSettings('highContrast')}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default UserSettingsPage;
