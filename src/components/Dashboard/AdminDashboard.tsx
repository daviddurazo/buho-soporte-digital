import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Users, Settings, FileText } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Panel de Administrador</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-unison-blue hover:bg-blue-700">
            <FileText className="mr-2 h-4 w-4" /> Nuevo Ticket
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <CardDescription>Total de Tickets</CardDescription>
                <CardTitle className="text-3xl">248</CardTitle>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm text-green-600 flex items-center">
              <span>↑ 12% </span>
              <span className="text-muted-foreground ml-1">vs. mes pasado</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <CardDescription>Usuarios Activos</CardDescription>
                <CardTitle className="text-3xl">1,423</CardTitle>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm text-green-600 flex items-center">
              <span>↑ 8% </span>
              <span className="text-muted-foreground ml-1">vs. mes pasado</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <CardDescription>Tiempo Resolución</CardDescription>
                <CardTitle className="text-3xl">4.2 h</CardTitle>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm text-red-600 flex items-center">
              <span>↑ 5% </span>
              <span className="text-muted-foreground ml-1">vs. objetivo</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <CardDescription>Satisfacción</CardDescription>
                <CardTitle className="text-3xl">94%</CardTitle>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm text-green-600 flex items-center">
              <span>↑ 2% </span>
              <span className="text-muted-foreground ml-1">vs. mes pasado</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <Tabs defaultValue="tickets" className="w-full">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Gestión del Sistema</CardTitle>
              <TabsList>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                <TabsTrigger value="auditoria">Auditoría</TabsTrigger>
                <TabsTrigger value="configuracion">Configuración</TabsTrigger>
              </TabsList>
            </div>
            <CardDescription>Administra todos los aspectos del sistema de soporte</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <TabsContent value="tickets" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Todos</Button>
                  <Button variant="outline" size="sm">Nuevos</Button>
                  <Button variant="outline" size="sm">En Progreso</Button>
                  <Button variant="outline" size="sm">Resueltos</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Exportar
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Título</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-left">Prioridad</th>
                      <th className="px-4 py-3 text-left">Categoría</th>
                      <th className="px-4 py-3 text-left">Creado por</th>
                      <th className="px-4 py-3 text-left">Asignado a</th>
                      <th className="px-4 py-3 text-left">Fecha</th>
                      <th className="px-4 py-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        id: 'T-1001',
                        title: 'Servidor principal fuera de servicio',
                        status: 'crítico',
                        priority: 'alta',
                        category: 'servidores',
                        creator: 'admin@unison.mx',
                        assignee: 'tech1@unison.mx',
                        date: '2023-06-03',
                      },
                      {
                        id: 'T-1002',
                        title: 'Renovación de licencias de software',
                        status: 'en_progreso',
                        priority: 'media',
                        category: 'software',
                        creator: 'admin@unison.mx',
                        assignee: 'tech2@unison.mx',
                        date: '2023-06-01',
                      },
                      {
                        id: 'T-1003',
                        title: 'Actualización de sistema operativo',
                        status: 'nuevo',
                        priority: 'baja',
                        category: 'software',
                        creator: 'prof1@unison.mx',
                        assignee: '-',
                        date: '2023-06-02',
                      },
                    ].map((ticket, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-blue-600 font-medium">{ticket.id}</td>
                        <td className="px-4 py-3 font-medium">{ticket.title}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${ticket.status === 'crítico' ? 'bg-red-100 text-red-800' : ''}
                            ${ticket.status === 'en_progreso' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${ticket.status === 'nuevo' ? 'bg-blue-100 text-blue-800' : ''}
                          `}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${ticket.priority === 'alta' ? 'bg-orange-100 text-orange-800' : ''}
                            ${ticket.priority === 'media' ? 'bg-blue-100 text-blue-800' : ''}
                            ${ticket.priority === 'baja' ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{ticket.category}</td>
                        <td className="px-4 py-3 text-muted-foreground">{ticket.creator}</td>
                        <td className="px-4 py-3 text-muted-foreground">{ticket.assignee}</td>
                        <td className="px-4 py-3 text-muted-foreground">{ticket.date}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline">Ver</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="usuarios" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Todos</Button>
                  <Button variant="outline" size="sm">Estudiantes</Button>
                  <Button variant="outline" size="sm">Profesores</Button>
                  <Button variant="outline" size="sm">Técnicos</Button>
                  <Button variant="outline" size="sm">Administradores</Button>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-unison-blue hover:bg-blue-700">
                    Nuevo Usuario
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Nombre</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Rol</th>
                      <th className="px-4 py-3 text-left">Creado</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        id: 'U-001',
                        name: 'Juan Pérez',
                        email: 'juan@unison.mx',
                        role: 'estudiante',
                        created: '2023-01-15',
                        status: 'activo',
                      },
                      {
                        id: 'U-002',
                        name: 'María García',
                        email: 'maria@unison.mx',
                        role: 'profesor',
                        created: '2022-08-20',
                        status: 'activo',
                      },
                      {
                        id: 'U-003',
                        name: 'Pedro Sánchez',
                        email: 'pedro@unison.mx',
                        role: 'técnico',
                        created: '2022-05-10',
                        status: 'inactivo',
                      },
                    ].map((user, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-blue-600 font-medium">{user.id}</td>
                        <td className="px-4 py-3 font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">{user.role}</td>
                        <td className="px-4 py-3 text-muted-foreground">{user.created}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${user.status === 'activo' ? 'bg-green-100 text-green-800' : ''}
                            ${user.status === 'inactivo' ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline">Editar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="auditoria" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Hoy</Button>
                  <Button variant="outline" size="sm">Esta semana</Button>
                  <Button variant="outline" size="sm">Este mes</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Exportar Logs
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Fecha/Hora</th>
                      <th className="px-4 py-3 text-left">Usuario</th>
                      <th className="px-4 py-3 text-left">Acción</th>
                      <th className="px-4 py-3 text-left">Detalles</th>
                      <th className="px-4 py-3 text-left">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        datetime: '2023-06-03 10:15:23',
                        user: 'admin@unison.mx',
                        action: 'login',
                        details: 'Inicio de sesión exitoso',
                        ip: '192.168.1.1',
                      },
                      {
                        datetime: '2023-06-03 09:45:12',
                        user: 'tech1@unison.mx',
                        action: 'ticket_update',
                        details: 'Cambio de estado de ticket T-1002 a En Progreso',
                        ip: '192.168.1.2',
                      },
                      {
                        datetime: '2023-06-03 09:30:05',
                        user: 'pedro@unison.mx',
                        action: 'ticket_create',
                        details: 'Creación de ticket T-1003',
                        ip: '192.168.1.3',
                      },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-muted-foreground">{log.datetime}</td>
                        <td className="px-4 py-3 font-medium">{log.user}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${log.action === 'login' ? 'bg-green-100 text-green-800' : ''}
                            ${log.action === 'ticket_update' ? 'bg-blue-100 text-blue-800' : ''}
                            ${log.action === 'ticket_create' ? 'bg-purple-100 text-purple-800' : ''}
                          `}>
                            {log.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{log.details}</td>
                        <td className="px-4 py-3 text-muted-foreground">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="configuracion" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="h-5 w-5 mr-2" /> Configuración General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Nombre del Sistema</label>
                      <Input defaultValue="Soporte Digital - UniSon" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Email de Soporte</label>
                      <Input defaultValue="soporte@unison.mx" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Tiempo Máximo de Resolución (horas)</label>
                      <Input type="number" defaultValue="24" />
                    </div>
                    <Button>Guardar Cambios</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Notificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Notificaciones por Email</span>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Notificaciones Push</span>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Plantillas de Email</span>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Servidor SMTP</span>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Categorías de Tickets</CardTitle>
                    <CardDescription>Gestionar las categorías disponibles</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 overflow-y-auto space-y-2">
                    {[
                      'WiFi Campus', 'Acceso Biblioteca', 'Plataforma LMS', 'Correo Institucional',
                      'Proyector Aula', 'Sistema Calificaciones', 'Hardware', 'Software',
                      'Redes', 'Servidores', 'Seguridad',
                    ].map((category, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded hover:bg-gray-100">
                        <span>{category}</span>
                        <div className="space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <div className="p-4 border-t flex justify-end">
                    <Button size="sm" onClick={() => window.location.href = "/config"}>Ir a Configuración</Button>
                  </div>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Respaldo y Restauración</CardTitle>
                    <CardDescription>Gestionar copias de seguridad</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Último respaldo: 2023-06-02 23:00:00
                      </p>
                      <Button variant="outline" className="w-full mb-2">Crear Respaldo Manual</Button>
                      <Button variant="outline" className="w-full">Restaurar desde Respaldo</Button>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Configuración de Respaldo Automático</label>
                      <select className="w-full p-2 border rounded">
                        <option>Diario (12:00 AM)</option>
                        <option>Semanal (Domingo, 12:00 AM)</option>
                        <option>Mensual (Día 1, 12:00 AM)</option>
                      </select>
                    </div>
                    <Button>Guardar Configuración</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminDashboard;
