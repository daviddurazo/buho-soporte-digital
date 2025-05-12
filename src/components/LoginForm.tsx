
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { LogIn, Mail } from 'lucide-react';
import { loginWithMicrosoft } from '@/services/MicrosoftAuth';

// Schema para validación
const loginSchema = z.object({
  email: z.string()
    .email('Correo electrónico inválido')
    .refine(val => val.endsWith('@unison.mx'), {
      message: 'El correo electrónico debe ser de dominio @unison.mx',
    }),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  
  // Configurar react-hook-form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Función para manejar el envío del formulario
  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función para manejar inicio de sesión con Microsoft
  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoading(true);
    try {
      const userData = await loginWithMicrosoft();
      toast.success('Inicio de sesión con Microsoft exitoso');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en inicio de sesión con Microsoft:', error);
    } finally {
      setIsMicrosoftLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>
      
      {/* Botón de inicio de sesión con Microsoft */}
      <div>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading || isMicrosoftLoading}
          className="w-full flex items-center justify-center gap-2"
          onClick={handleMicrosoftLogin}
        >
          {isMicrosoftLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"></path>
                <path fill="#f35325" d="M1 1h10v10H1z"></path>
                <path fill="#81bc06" d="M12 1h10v10H12z"></path>
                <path fill="#05a6f0" d="M1 12h10v10H1z"></path>
                <path fill="#ffba08" d="M12 12h10v10H12z"></path>
              </svg>
              <span>Iniciar sesión con Microsoft</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continúa con
          </span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="correo@unison.mx"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Contraseña</FormLabel>
                  <Link 
                    to="/auth?mode=forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isMicrosoftLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar sesión
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link 
          to="/auth?mode=register" 
          className="font-medium text-primary hover:underline"
        >
          Regístrate
        </Link>
      </div>
    </div>
  );
}
