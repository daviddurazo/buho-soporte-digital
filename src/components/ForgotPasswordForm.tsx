
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { UnisonLogo } from './UnisonLogo';
import { ArrowLeft, Mail } from 'lucide-react';

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
      toast.success("Correo de restablecimiento enviado");
    } catch (error) {
      console.error("Error sending reset password:", error);
      toast.error("Error al enviar el correo de restablecimiento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="space-y-2 items-center text-center">
        <UnisonLogo size="md" />
        <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
        <CardDescription>
          {!isSubmitted ? 
            "Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña" :
            "Revise su bandeja de entrada y siga las instrucciones enviadas a su correo electrónico"
          }
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
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Enviando..." : "Enviar Instrucciones"}
            </Button>
          </form>
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <p className="text-green-800 mb-4">
              Hemos enviado un correo electrónico con instrucciones para restablecer su contraseña a <strong>{email}</strong>.
            </p>
            <p className="text-sm text-gray-600">
              Si no recibe el correo dentro de unos minutos, revise su carpeta de spam.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="flex items-center text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio de sesión
        </Button>
      </CardFooter>
    </Card>
  );
};
