
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TicketDetailDrawer } from './TicketDetailDrawer';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Ticket, TicketStatus, TicketPriority, translateStatus, translatePriority, translateCategory, technicianCategories } from '@/types';
import { 
  Clock, 
  Check, 
  MessageSquare, 
  Users, 
  Flag, 
  ListCheck, 
  ArrowDown,
  ArrowUp,
  SquareCheck,
  Search,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Helper function to calculate SLA remaining time
const calculateSLARemaining = (ticket: Ticket): string => {
  if (!ticket.due_date) return "No definido";

  const dueDate = new Date(ticket.due_date);
  const now = new Date();
  const hoursElapsed = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60));
  
  // If due date has passed
  if (hoursElapsed > 0) {
    return "¡Vencido!";
  }
  
  // Convert back to positive hours remaining
  const remainingHours = Math.abs(hoursElapsed);
  
  // Return formatted string
  if (remainingHours <= 1) {
    return "< 1 hora";
  } else if (remainingHours < 24) {
    return `${remainingHours} horas`;
  } else {
    return `${Math.floor(remainingHours / 24)} días ${remainingHours % 24} hrs`;
  }
};

// Helper function to determine if SLA is critical
const isSLACritical = (ticket: Ticket): boolean => {
  if (!ticket.due_date) return false;
  
  const dueDate = new Date(ticket.due_date);
  const now = new Date();
  const hoursRemaining = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  return hoursRemaining <= 2;
};

// Helper function to validate ticket status
const validateTicketStatus = (status: string): TicketStatus => {
  const validStatuses: TicketStatus[] = ['nuevo', 'asignado', 'en_progreso', 'resuelto', 'cerrado'];
  return validStatuses.includes(status as TicketStatus) 
    ? status as TicketStatus 
    : 'nuevo'; // Default fallback if invalid status
};

// Helper function to validate ticket priority
const validateTicketPriority = (priority: string): TicketPriority => {
  const validPriorities: TicketPriority[] = ['baja', 'media', 'alta', 'crítica'];
  return validPriorities.includes(priority as TicketPriority)
    ? priority as TicketPriority
    : 'media'; // Default fallback if invalid priority
};

// Type for database ticket to handle type conversion
interface DatabaseTicket {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  creator_id: string | null;
  assigned_to_id: string | null;
  due_date: string | null;
}

// Function to convert DatabaseTicket to Ticket
const convertToTicket = (dbTicket: DatabaseTicket): Ticket => {
  return {
    ...dbTicket,
    status: validateTicketStatus(dbTicket.status),
    priority: validateTicketPriority(dbTicket.priority)
  };
};

export const TechnicianTickets: React.FC = () => {
  const { user } = useAuth();
  // States for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // States for selected ticket and drawer
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // States for ticket selection (mass actions)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch tickets from Supabase
  const fetchTickets = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('assigned_to_id', user.id);

    if (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }

    // Convert the database tickets to our Ticket type
    return data.map(convertToTicket);
  };

  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['technicianTickets', user?.id],
    queryFn: fetchTickets,
    enabled: !!user,
  });
  
  // Apply filters to tickets
  const filteredTickets = tickets.filter((ticket: Ticket) => {
    // Apply search query filter
    const matchesSearch = searchQuery 
      ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    // Apply priority filter
    const matchesPriority = priorityFilter 
      ? ticket.priority === priorityFilter
      : true;
    
    // Apply category filter
    const matchesCategory = categoryFilter 
      ? ticket.category === categoryFilter
      : true;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });
  
  // Handle row click to open drawer
  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };
  
  // Handle checkbox change
  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
    }
  };
  
  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedTickets(filteredTickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };
  
  // Handle mass actions
  const handleMassChangeStatus = async (status: TicketStatus) => {
    if (selectedTickets.length === 0) {
      toast.error('No hay tickets seleccionados');
      return;
    }
    
    try {
      for (const id of selectedTickets) {
        const { error } = await supabase
          .from('tickets')
          .update({ 
            status,
            updated_at: new Date().toISOString() 
          })
          .eq('id', id);
          
        if (error) throw error;
      }
      
      toast.success(`Estado actualizado a: ${translateStatus(status)} para ${selectedTickets.length} tickets`);
      setSelectedTickets([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Error updating tickets:', error);
      toast.error('Error al actualizar el estado de los tickets');
    }
  };
  
  const handleMassReassign = () => {
    if (selectedTickets.length === 0) {
      toast.error('No hay tickets seleccionados');
      return;
    }
    
    // In a real app, you'd open a dialog to select user
    toast.success(`${selectedTickets.length} tickets reasignados`);
    setSelectedTickets([]);
    setSelectAll(false);
  };
  
  // Render priority badge with appropriate color
  const renderPriorityBadge = (priority: TicketPriority) => {
    const colors = {
      'crítica': 'bg-red-500 text-white',
      'alta': 'bg-orange-500 text-white',
      'media': 'bg-yellow-500 text-black',
      'baja': 'bg-blue-500 text-white',
    };
    
    return (
      <div className="flex items-center gap-2">
        <Flag 
          className={`h-4 w-4 ${priority === 'crítica' ? 'text-white' : ''}`} 
          style={{
            color: priority === 'crítica' ? 'white' : 
                   priority === 'alta' ? 'white' :
                   priority === 'media' ? 'black' : 'white'
          }}
        />
        <Badge className={colors[priority]}>
          {translatePriority(priority)}
        </Badge>
      </div>
    );
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: TicketStatus) => {
    const colors = {
      'nuevo': 'bg-purple-500 text-white',
      'asignado': 'bg-blue-500 text-white',
      'en_progreso': 'bg-yellow-500 text-black',
      'resuelto': 'bg-green-500 text-white',
      'cerrado': 'bg-gray-500 text-white',
    };
    
    return (
      <Badge className={colors[status]}>
        {translateStatus(status)}
      </Badge>
    );
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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="Buscar por ID o título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
        </div>
        <Select 
          value={priorityFilter || ''} 
          onValueChange={(value) => setPriorityFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las prioridades</SelectItem>
            <SelectItem value="crítica">Crítica</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          value={categoryFilter || ''} 
          onValueChange={(value) => setCategoryFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las categorías</SelectItem>
            {technicianCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {translateCategory(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Actions for mass operations */}
      {selectedTickets.length > 0 && (
        <Card className="p-3 mb-4 bg-[#E5DEFF]">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''} seleccionado{selectedTickets.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex gap-2">
              <Select onValueChange={(status) => handleMassChangeStatus(status as TicketStatus)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Cambiar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="asignado">Asignado</SelectItem>
                  <SelectItem value="en_progreso">En progreso</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleMassReassign} variant="outline" className="bg-white">
                <Users className="mr-2 h-4 w-4" />
                Reasignar
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Tickets table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectAll} 
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                />
              </TableHead>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  SLA Restante
                </div>
              </TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id} 
                  onClick={() => handleRowClick(ticket)}
                  className="cursor-pointer"
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedTickets.includes(ticket.id)}
                      onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked === true)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{translateCategory(ticket.category)}</TableCell>
                  <TableCell>{renderPriorityBadge(ticket.priority as TicketPriority)}</TableCell>
                  <TableCell>{renderStatusBadge(ticket.status as TicketStatus)}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${isSLACritical(ticket) ? 'text-red-600' : ''}`}>
                      {calculateSLARemaining(ticket)}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(ticket.created_at).toLocaleString('es-ES', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ListCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No se encontraron tickets con los filtros actuales
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Detail drawer */}
      {selectedTicket && (
        <TicketDetailDrawer 
          ticket={selectedTicket}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
};
