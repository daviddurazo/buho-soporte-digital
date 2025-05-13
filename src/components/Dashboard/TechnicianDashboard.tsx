
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { TicketStatus, TicketPriority } from '@/types';

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchTechnicianTickets = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('assigned_to_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching technician tickets:', error);
      throw error;
    }
    
    return data || [];
  };
  
  const fetchAllTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching all tickets:', error);
      throw error;
    }
    
    return data || [];
  };
  
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['technicianDashboardTickets'],
    queryFn: fetchAllTickets,
  });
  
  const filteredTickets = tickets.filter((ticket: any) => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const assignedToMe = filteredTickets.filter((ticket: any) => 
    ticket.assigned_to_id === user?.id && 
    (ticket.status === 'asignado' || ticket.status === 'en_progreso')
  );
  
  const unassignedTickets = filteredTickets.filter((ticket: any) => ticket.status === 'nuevo');
  
  const getPriorityBadgeClass = (priority: string) => {
    switch(priority) {
      case 'baja':
        return 'bg-gray-100 text-gray-800';
      case 'media':
        return 'bg-blue-100 text-blue-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'crítica':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'nuevo':
        return 'bg-blue-100 text-blue-800';
      case 'asignado':
        return 'bg-purple-100 text-purple-800';
      case 'en_progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'resuelto':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const translateStatus = (status: string) => {
    switch(status) {
      case 'nuevo':
        return 'Nuevo';
      case 'asignado':
        return 'Asignado';
      case 'en_progreso':
        return 'En Progreso';
      case 'resuelto':
        return 'Resuelto';
      case 'cerrado':
        return 'Cerrado';
      default:
        return status;
    }
  };
  
  const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'hardware': 'Hardware',
      'software': 'Software',
      'redes': 'Redes',
      'servidores': 'Servidores',
      'software_academico': 'Software Académico',
      'sistema_calificaciones': 'Sistema de Calificaciones',
    };
    
    return categoryMap[category] || category;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-lg text-gray-500">Cargando tickets...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
        <p className="font-medium">Error al cargar los tickets</p>
        <p className="text-sm">Por favor, intenta nuevamente más tarde.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Panel de Técnico</h2>
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tickets..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Lista de Tickets</CardTitle>
          <CardDescription>Administra las incidencias actuales</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="assigned">
                Asignados a mí ({assignedToMe.length})
              </TabsTrigger>
              <TabsTrigger value="unassigned">
                Sin asignar ({unassignedTickets.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Todos ({filteredTickets.length})
              </TabsTrigger>
            </TabsList>
            
            {['assigned', 'unassigned', 'all'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Título</th>
                        <th className="px-4 py-3 text-left">Prioridad</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                        <th className="px-4 py-3 text-left">Creado</th>
                        <th className="px-4 py-3 text-left">Categoría</th>
                        <th className="px-4 py-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(tab === 'assigned' ? assignedToMe : 
                        tab === 'unassigned' ? unassignedTickets : 
                          filteredTickets).map((ticket: any) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-blue-600 font-medium">{ticket.ticket_number}</td>
                          <td className="px-4 py-3 font-medium">{ticket.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                              {translateStatus(ticket.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(ticket.created_at).toLocaleDateString('es-MX')}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {translateCategory(ticket.category)}
                          </td>
                          <td className="px-4 py-3">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/tickets`}>Ver</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {(tab === 'assigned' ? assignedToMe : 
                    tab === 'unassigned' ? unassignedTickets : 
                      filteredTickets).length === 0 && (
                    <p className="text-center py-4 text-muted-foreground">
                      No hay tickets que mostrar
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumen</CardTitle>
            <CardDescription>Visión general de tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total de Tickets</span>
              <span className="font-medium">{tickets.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sin Asignar</span>
              <span className="font-medium">{unassignedTickets.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Asignados a mí</span>
              <span className="font-medium">{assignedToMe.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Prioridad Alta/Crítica</span>
              <span className="font-medium">{tickets.filter((t: any) => t.priority === 'alta' || t.priority === 'crítica').length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Por Categoría</CardTitle>
            <CardDescription>Distribución de tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hardware</span>
              <span className="font-medium">{tickets.filter((t: any) => t.category === 'hardware').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Software</span>
              <span className="font-medium">{tickets.filter((t: any) => t.category === 'software').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Redes</span>
              <span className="font-medium">{tickets.filter((t: any) => t.category === 'redes').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Otros</span>
              <span className="font-medium">
                {tickets.filter((t: any) => 
                  t.category !== 'hardware' && 
                  t.category !== 'software' && 
                  t.category !== 'redes'
                ).length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tickets Críticos</CardTitle>
            <CardDescription>Requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.filter((t: any) => t.priority === 'crítica').length > 0 ? (
              <div className="space-y-2">
                {tickets
                  .filter((t: any) => t.priority === 'crítica')
                  .map((ticket: any) => (
                    <div key={ticket.id} className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-red-800 font-medium">{ticket.title}</p>
                          <p className="text-xs text-red-700">{ticket.ticket_number}</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100" asChild>
                          <Link to={`/tickets`}>
                            Atender
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center py-4 text-green-600 bg-green-50 rounded-md">
                No hay tickets críticos pendientes
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
