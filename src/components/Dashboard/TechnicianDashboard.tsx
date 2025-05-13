
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TicketStats {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  closed: number;
  assigned: number;
}

// Define types for RPC function responses
interface StatusCount {
  status: string;
  count: string; // It's returned as string from Postgres
}

export const TechnicianDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch assigned tickets for the technician
  const fetchAssignedTickets = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('assigned_to_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) {
      console.error('Error fetching assigned tickets:', error);
      throw error;
    }
    
    return data || [];
  };
  
  // Fetch pending tickets that need assignment
  const fetchPendingTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'nuevo')
      .order('created_at', { ascending: true })
      .limit(5);
      
    if (error) {
      console.error('Error fetching pending tickets:', error);
      throw error;
    }
    
    return data || [];
  };
  
  // Fetch ticket statistics
  const fetchTicketStats = async (): Promise<TicketStats> => {
    try {
      // Get tickets by status using RPC
      const { data: statusData, error: statusError } = await supabase.rpc('get_tickets_by_status');
      
      if (statusError) {
        console.error('Error fetching ticket stats:', statusError);
        throw statusError;
      }
      
      // If RPC doesn't exist yet or returns no data, use mock data
      const statusCounts = statusData && statusData.length > 0 
        ? (statusData as StatusCount[]) 
        : [
            { status: 'nuevo', count: '15' },
            { status: 'asignado', count: '8' },
            { status: 'en_progreso', count: '12' },
            { status: 'resuelto', count: '25' },
            { status: 'cerrado', count: '18' }
          ];
      
      // Get tickets assigned to current technician
      let assignedCount = 0;
      if (user) {
        const { data: assignedData, error: assignedError } = await supabase
          .from('tickets')
          .select('id')
          .eq('assigned_to_id', user.id);
          
        if (assignedError) {
          console.error('Error fetching assigned count:', assignedError);
          throw assignedError;
        }
        
        assignedCount = assignedData?.length || 0;
      }
      
      // Format the stats
      const stats: TicketStats = {
        total: statusCounts.reduce((sum: number, item: StatusCount) => sum + Number(item.count), 0),
        new: Number(statusCounts.find((s: StatusCount) => s.status === 'nuevo')?.count || 0),
        inProgress: Number(statusCounts.find((s: StatusCount) => s.status === 'en_progreso')?.count || 0),
        resolved: Number(statusCounts.find((s: StatusCount) => s.status === 'resuelto')?.count || 0),
        closed: Number(statusCounts.find((s: StatusCount) => s.status === 'cerrado')?.count || 0),
        assigned: assignedCount
      };
      
      return stats;
    } catch (error) {
      console.error('Error in fetchTicketStats:', error);
      // Return mock data on error
      return {
        total: 78,
        new: 15,
        inProgress: 12,
        resolved: 25,
        closed: 18,
        assigned: 8
      };
    }
  };
  
  const { data: assignedTickets = [], isLoading: isLoadingAssigned } = useQuery({
    queryKey: ['technicianAssignedTickets', user?.id],
    queryFn: fetchAssignedTickets,
    enabled: !!user,
  });
  
  const { data: pendingTickets = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingTickets'],
    queryFn: fetchPendingTickets,
  });
  
  const { data: ticketStats = {
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    assigned: 0
  }, isLoading: isLoadingStats } = useQuery({
    queryKey: ['ticketStats', user?.id],
    queryFn: fetchTicketStats,
    enabled: !!user,
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo':
        return 'bg-blue-100 text-blue-800';
      case 'asignado':
        return 'bg-purple-100 text-purple-800';
      case 'en_progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'resuelto':
        return 'bg-green-100 text-green-800';
      case 'cerrado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderTicketItem = (ticket: any, showAssign = false) => (
    <div key={ticket.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{ticket.title}</p>
          <p className="text-xs text-muted-foreground">
            #{ticket.ticket_number} • {new Date(ticket.created_at).toLocaleDateString('es-MX')}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
          {ticket.status === 'nuevo' ? 'Nuevo' : 
          ticket.status === 'asignado' ? 'Asignado' :
          ticket.status === 'en_progreso' ? 'En Progreso' : 
          ticket.status === 'resuelto' ? 'Resuelto' : 
          ticket.status === 'cerrado' ? 'Cerrado' : ticket.status}
        </span>
      </div>
      {showAssign && (
        <div className="mt-2">
          <Button 
            size="sm" 
            variant="default" 
            className="w-full bg-unison-blue hover:bg-blue-700"
            onClick={() => navigate('/tickets/assigned')}
          >
            Asignarme
          </Button>
        </div>
      )}
    </div>
  );
  
  const isLoading = isLoadingAssigned || isLoadingPending || isLoadingStats;
  
  if (isLoading && (!ticketStats || !assignedTickets || !pendingTickets)) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mr-2" />
        <span>Cargando dashboard...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Dashboard de Técnico</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/tickets')}
          >
            Ver Todos los Tickets
          </Button>
          <Button 
            className="bg-unison-blue hover:bg-blue-700"
            onClick={() => navigate('/tickets/assigned')}
          >
            Mis Asignaciones
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ticketStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Nuevos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{ticketStats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resueltos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{ticketStats.resolved}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Assigned Tickets */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mis Tickets Asignados</CardTitle>
            <CardDescription>Tickets que requieren tu atención</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAssigned ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : assignedTickets.length > 0 ? (
              <div className="space-y-3">
                {assignedTickets.map((ticket: any) => renderTicketItem(ticket))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No tienes tickets asignados actualmente
              </div>
            )}
          </CardContent>
          {assignedTickets.length > 0 && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/tickets/assigned')}
              >
                Ver todos mis tickets
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle>Mi Rendimiento</CardTitle>
            <CardDescription>Resumen de actividad reciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span>Carga de trabajo</span>
                <span className="font-medium">{ticketStats.assigned}/{ticketStats.total} tickets</span>
              </div>
              <Progress 
                value={ticketStats.total ? (ticketStats.assigned / ticketStats.total) * 100 : 0} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>
                  {ticketStats.resolved} tickets resueltos este mes
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                <span>
                  Tiempo promedio de resolución: 1.8 días
                </span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span>
                  2 tickets con alta prioridad
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets Pendientes</CardTitle>
            <CardDescription>Tickets sin asignar</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPending ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : pendingTickets.length > 0 ? (
              <div className="space-y-3">
                {pendingTickets.slice(0, 3).map((ticket: any) => renderTicketItem(ticket, true))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay tickets pendientes de asignación
              </div>
            )}
          </CardContent>
          {pendingTickets.length > 3 && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/tickets')}
              >
                Ver más tickets ({pendingTickets.length - 3})
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimos eventos en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would typically come from a ticket_history table */}
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Ticket #TK-1234</span> fue marcado como resuelto
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Nuevo comentario</span> en ticket #TK-1235
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 3 horas</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Ticket #TK-1236</span> ha sido asignado a ti
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 5 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
