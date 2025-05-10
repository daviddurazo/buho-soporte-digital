
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { UnisonLogo } from './UnisonLogo';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.endsWith('@unison.mx')) {
      toast.error("El correo electrónico debe ser de dominio @unison.mx");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Enlace de restablecimiento enviado. Revise su correo electrónico.");
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error("Error al enviar el enlace: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="space-y-2 items-center text-center">
        <UnisonLogo size="md" />
        <CardTitle className="text-2xl font-bold">Restablecer Contraseña</CardTitle>
        <CardDescription>
          Ingrese su correo electrónico para recibir un enlace de restablecimiento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button 
              type="submit" 
              className="w-full bg-unison-blue hover:bg-blue-700" 
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Enlace de Restablecimiento"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="rounded-full w-16 h-16 bg-green-100 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p>
              Hemos enviado un correo electrónico a <strong>{email}</strong> con instrucciones para restablecer su contraseña.
            </p>
            <p className="text-sm text-muted-foreground">
              Si no recibe el correo electrónico en unos minutos, revise su carpeta de spam o inténtelo de nuevo.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-center text-muted-foreground">
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className="text-unison-blue hover:underline font-medium"
          >
            Volver al inicio de sesión
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};
