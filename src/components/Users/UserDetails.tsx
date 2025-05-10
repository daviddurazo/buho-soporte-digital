
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRole } from "@/types";

interface UserDetailsProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    active: boolean;
    createdAt: string;
  };
}

const UserDetails = ({ user }: UserDetailsProps) => {
  // Mock data for tickets and activity
  const mockTickets = [
    {
      id: "T-1001",
      title: "Problemas con acceso al sistema",
      status: "resuelto",
      priority: "alta",
      category: "acceso_biblioteca",
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "T-1002",
      title: "Error en plataforma de calificaciones",
      status: "cerrado",
      priority: "media",
      category: "sistema_calificaciones",
      createdAt: "2023-06-05T14:45:00Z",
    },
    {
      id: "T-1003",
      title: "Solicitud de software académico",
      status: "nuevo",
      priority: "baja",
      category: "software_academico",
      createdAt: "2023-07-20T09:15:00Z",
    },
  ];

  const mockActivity = [
    {
      id: "A-001",
      action: "Inicio de sesión",
      timestamp: "2023-07-22T08:30:00Z",
      details: "Inicio de sesión desde 192.168.1.123",
    },
    {
      id: "A-002",
      action: "Creación de ticket",
      timestamp: "2023-07-20T09:15:00Z",
      details: "Creó el ticket T-1003",
    },
    {
      id: "A-003",
      action: "Actualización de perfil",
      timestamp: "2023-07-10T11:45:00Z",
      details: "Actualizó información de contacto",
    },
    {
      id: "A-004",
      action: "Inicio de sesión",
      timestamp: "2023-07-05T08:15:00Z",
      details: "Inicio de sesión desde 192.168.1.123",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const translateRole = (role: UserRole) => {
    const roleTranslations: Record<UserRole, string> = {
      student: "Estudiante",
      professor: "Profesor",
      technician: "Técnico",
      admin: "Administrador",
    };
    
    return roleTranslations[role] || role;
  };

  const translateStatus = (status: string) => {
    const statusTranslations: Record<string, string> = {
      nuevo: "Nuevo",
      asignado: "Asignado",
      en_progreso: "En Progreso",
      resuelto: "Resuelto",
      cerrado: "Cerrado",
    };
    
    return statusTranslations[status] || status;
  };

  const translateCategory = (category: string) => {
    const categoryTranslations: Record<string, string> = {
      acceso_biblioteca: "Acceso a Biblioteca",
      sistema_calificaciones: "Sistema de Calificaciones",
      software_academico: "Software Académico",
      wifi_campus: "WiFi del Campus",
      proyector_aula: "Proyector de Aula",
    };
    
    return categoryTranslations[category] || category;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">ID</h4>
              <p>{user.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
              <p>{user.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Nombre Completo</h4>
              <p>{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Rol</h4>
              <p>{translateRole(user.role)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado</h4>
              <Badge
                variant={user.active ? "default" : "outline"}
                className={user.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
              >
                {user.active ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Registro</h4>
              <p>{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tickets">
        <TabsList className="mb-2">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Este usuario no tiene tickets registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    mockTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{translateCategory(ticket.category)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              ticket.status === "nuevo" || ticket.status === "asignado"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : ticket.status === "en_progreso"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-green-100 text-green-800 hover:bg-green-100"
                            }
                          >
                            {translateStatus(ticket.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              ticket.priority === "alta" || ticket.priority === "crítica"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : ticket.priority === "media"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            }
                          >
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registro de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="pb-4 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</div>
                    </div>
                    <div className="text-sm mt-1">{activity.details}</div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetails;
