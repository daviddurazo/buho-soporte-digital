
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnisonLogo } from './UnisonLogo';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.endsWith('@unison.mx')) {
      toast.error("El correo electrónico debe ser de dominio @unison.mx");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(firstName, lastName, email, password, role);
      toast.success("Registro exitoso");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Error al registrarse: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="space-y-2 items-center text-center">
        <UnisonLogo size="lg" />
        <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
        <CardDescription>
          Regístrese con su correo institucional para acceder al sistema de soporte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
                aria-label="Nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
                aria-label="Apellido"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="nombre@unison.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              aria-label="Correo Electrónico"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              disabled={isLoading}
            >
              <SelectTrigger id="role" aria-label="Seleccionar Rol">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Estudiante</SelectItem>
                <SelectItem value="professor">Profesor</SelectItem>
                <SelectItem value="technician">Técnico</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              aria-label="Contraseña"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              aria-label="Confirmar Contraseña"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-unison-blue hover:bg-blue-700" 
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-center text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className="text-unison-blue hover:underline font-medium"
          >
            Iniciar sesión
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};
