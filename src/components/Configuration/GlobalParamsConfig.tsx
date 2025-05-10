
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";

// Global parameter type definition
type GlobalParam = {
  id: string;
  name: string;
  key: string;
  value: string | number | boolean;
  type: "string" | "number" | "boolean";
  category: string;
  description: string;
};

// Mock data for global parameters
const initialGlobalParams: GlobalParam[] = [
  // Session settings
  {
    id: "param-1",
    name: "Tiempo de sesión",
    key: "session_timeout",
    value: 30,
    type: "number",
    category: "session",
    description: "Tiempo máximo de inactividad antes de cerrar sesión (minutos)"
  },
  {
    id: "param-2",
    name: "Recordar sesión",
    key: "remember_session",
    value: true,
    type: "boolean",
    category: "session",
    description: "Permitir a los usuarios mantener la sesión iniciada"
  },
  
  // Security settings
  {
    id: "param-3",
    name: "Intentos de inicio de sesión",
    key: "login_attempts",
    value: 5,
    type: "number",
    category: "security",
    description: "Intentos fallidos antes de bloquear la cuenta"
  },
  {
    id: "param-4",
    name: "Bloqueo de cuentas",
    key: "account_lockout",
    value: true,
    type: "boolean",
    category: "security",
    description: "Bloquear cuentas después de múltiples intentos fallidos"
  },
  {
    id: "param-5",
    name: "Tiempo de bloqueo",
    key: "lockout_time",
    value: 15,
    type: "number",
    category: "security",
    description: "Tiempo de bloqueo de cuenta después de intentos fallidos (minutos)"
  },
  
  // Ticket settings
  {
    id: "param-6",
    name: "Tamaño máximo de adjuntos",
    key: "max_attachment_size",
    value: 10,
    type: "number",
    category: "tickets",
    description: "Tamaño máximo de archivos adjuntos en MB"
  },
  {
    id: "param-7",
    name: "Máximo de adjuntos por ticket",
    key: "max_attachments",
    value: 5,
    type: "number",
    category: "tickets",
    description: "Número máximo de archivos adjuntos por ticket"
  },
  {
    id: "param-8",
    name: "Notificaciones por email",
    key: "email_notifications",
    value: true,
    type: "boolean",
    category: "notifications",
    description: "Enviar notificaciones por correo electrónico"
  },
  
  // General settings
  {
    id: "param-9",
    name: "Nombre del sistema",
    key: "system_name",
    value: "Soporte UNISON",
    type: "string",
    category: "general",
    description: "Nombre visible del sistema de soporte"
  },
  {
    id: "param-10",
    name: "Email de soporte",
    key: "support_email",
    value: "soporte@unison.mx",
    type: "string",
    category: "general",
    description: "Correo electrónico principal de soporte"
  },
];

const GlobalParamsConfig = () => {
  const { toast } = useToast();
  const [globalParams, setGlobalParams] = useState<GlobalParam[]>(initialGlobalParams);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter parameters based on search term
  const filteredParams = globalParams.filter(param => 
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group parameters by category
  const groupedParams = filteredParams.reduce((acc: Record<string, GlobalParam[]>, param) => {
    if (!acc[param.category]) {
      acc[param.category] = [];
    }
    acc[param.category].push(param);
    return acc;
  }, {});

  const handleValueChange = (id: string, newValue: string | number | boolean) => {
    setGlobalParams(globalParams.map(param => 
      param.id === id ? { ...param, value: newValue } : param
    ));
  };

  const handleSaveChanges = () => {
    toast({
      title: "Configuración guardada",
      description: "Los parámetros globales han sido actualizados exitosamente.",
    });
  };

  // Helper function to render the appropriate input based on parameter type
  const renderParamInput = (param: GlobalParam) => {
    switch (param.type) {
      case "boolean":
        return (
          <Switch 
            checked={param.value as boolean}
            onCheckedChange={(checked) => handleValueChange(param.id, checked)}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={param.value as number}
            onChange={(e) => handleValueChange(param.id, Number(e.target.value))}
            className="w-20 text-center"
          />
        );
      case "string":
        return (
          <Input
            type="text"
            value={param.value as string}
            onChange={(e) => handleValueChange(param.id, e.target.value)}
            className="w-full max-w-[240px]"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Buscar parámetros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <Button onClick={handleSaveChanges}>
          <Save className="h-4 w-4 mr-2" /> Guardar Cambios
        </Button>
      </div>
      
      {Object.keys(groupedParams).length > 0 ? (
        Object.entries(groupedParams).map(([category, params]) => (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Settings className="h-5 w-5 mr-2" /> 
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </CardTitle>
              <CardDescription>
                {category === "session" && "Configuración de sesiones de usuario"}
                {category === "security" && "Parámetros de seguridad del sistema"}
                {category === "tickets" && "Configuración de tickets y adjuntos"}
                {category === "notifications" && "Configuración de notificaciones"}
                {category === "general" && "Parámetros generales del sistema"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Parámetro</TableHead>
                    <TableHead className="hidden md:table-cell">Descripción</TableHead>
                    <TableHead className="w-[200px]">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {params.map((param) => (
                    <TableRow key={param.id}>
                      <TableCell className="font-medium">{param.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {param.description}
                      </TableCell>
                      <TableCell>
                        {renderParamInput(param)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron parámetros que coincidan con la búsqueda
        </div>
      )}
    </div>
  );
};

export default GlobalParamsConfig;
