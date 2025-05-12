
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
  Search
} from 'lucide-react';

// Mock data for tickets - updated with proper field name assignedToId instead of assigneeId
const mockTickets: Ticket[] = [
  {
    id: 'TK-1001',
    title: 'No puedo acceder a mi cuenta de correo institucional',
    description: 'Cuando intento iniciar sesión me dice que la contraseña es incorrecta, pero estoy seguro de que es la correcta',
    status: 'asignado',
    priority: 'alta',
    category: 'correo_institucional',
    createdAt: '2025-05-01T10:30:00Z',
    updatedAt: '2025-05-01T14:20:00Z',
    creatorId: 'user-123',
    assignedToId: 'tech-001',
    dueDate: '2025-05-03T14:20:00Z'
  },
  {
    id: 'TK-1002',
    title: 'Proyector de aula 305 no funciona',
    description: 'El proyector no enciende y la clase comienza en 30 minutos',
    status: 'en_progreso',
    priority: 'crítica',
    category: 'proyector_aula',
    createdAt: '2025-05-01T09:15:00Z',
    updatedAt: '2025-05-01T09:45:00Z',
    creatorId: 'user-456',
    assignedToId: 'tech-001',
    dueDate: '2025-05-02T09:45:00Z'
  },
  {
    id: 'TK-1003',
    title: 'Software AutoCAD no se instala correctamente',
    description: 'Aparece un error de compatibilidad durante la instalación',
    status: 'nuevo',
    priority: 'media',
    category: 'software',
    createdAt: '2025-05-02T11:00:00Z',
    updatedAt: '2025-05-02T11:00:00Z',
    creatorId: 'user-789',
    assignedToId: 'tech-001',
    dueDate: '2025-05-04T11:00:00Z'
  },
  {
    id: 'TK-1004',
    title: 'Red WiFi inestable en biblioteca',
    description: 'La conexión se cae constantemente en la zona de estudio',
    status: 'nuevo',
    priority: 'baja',
    category: 'redes',
    createdAt: '2025-05-03T08:30:00Z',
    updatedAt: '2025-05-03T08:30:00Z',
    creatorId: 'user-101',
    assignedToId: 'tech-001',
    dueDate: '2025-05-06T08:30:00Z'
  },
  {
    id: 'TK-1005',
    title: 'Computadora de laboratorio no enciende',
    description: 'PC #12 del laboratorio de informática no muestra señales de vida',
    status: 'en_progreso',
    priority: 'alta',
    category: 'hardware',
    createdAt: '2025-05-04T13:45:00Z',
    updatedAt: '2025-05-04T14:30:00Z',
    creatorId: 'user-202',
    assignedToId: 'tech-001',
    dueDate: '2025-05-05T13:45:00Z'
  },
];

// Helper function to calculate SLA remaining time
const calculateSLARemaining = (ticket: Ticket): string => {
  // For demo purposes, we'll create some logic based on priority and creation date
  const creationDate = new Date(ticket.createdAt);
  const now = new Date();
  const hoursElapsed = Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60));
  
  // Different SLA times based on priority
  let slaHours = 0;
  switch(ticket.priority) {
    case 'crítica': slaHours = 4; break;
    case 'alta': slaHours = 8; break;
    case 'media': slaHours = 24; break;
    case 'baja': slaHours = 48; break;
  }
  
  const remainingHours = slaHours - hoursElapsed;
  
  // Return formatted string
  if (remainingHours <= 0) {
    return "¡Vencido!";
  } else if (remainingHours <= 1) {
    return "< 1 hora";
  } else if (remainingHours < 24) {
    return `${remainingHours} horas`;
  } else {
    return `${Math.floor(remainingHours / 24)} días ${remainingHours % 24} hrs`;
  }
};

// Helper function to determine if SLA is critical
const isSLACritical = (ticket: Ticket): boolean => {
  const creationDate = new Date(ticket.createdAt);
  const now = new Date();
  const hoursElapsed = Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60));
  
  let slaHours = 0;
  switch(ticket.priority) {
    case 'crítica': slaHours = 4; break;
    case 'alta': slaHours = 8; break;
    case 'media': slaHours = 24; break;
    case 'baja': slaHours = 48; break;
  }
  
  return (slaHours - hoursElapsed) <= 2;
};

export const TechnicianTickets: React.FC = () => {
  // States for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // States for selected ticket and drawer
  const [selectedTicket, setSelectedTicket] = useState<(Ticket & { dueDate: string }) | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // States for ticket selection (mass actions)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Apply filters to tickets
  const filteredTickets = mockTickets.filter((ticket) => {
    // Apply search query filter
    const matchesSearch = searchQuery 
      ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
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
    // Create a new object that guarantees dueDate exists and is a string
    const ticketWithDueDate = {
      ...ticket,
      dueDate: ticket.dueDate || new Date().toISOString() // Use existing dueDate or set default
    };
    
    // Now TypeScript knows ticketWithDueDate always has a dueDate property
    // Use type assertion after creating the object with required properties
    setSelectedTicket(ticketWithDueDate as Ticket & { dueDate: string });
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
  const handleMassChangeStatus = (status: TicketStatus) => {
    if (selectedTickets.length === 0) {
      toast.error('No hay tickets seleccionados');
      return;
    }
    
    // In a real app, you'd call an API here
    toast.success(`Estado actualizado a: ${translateStatus(status)} para ${selectedTickets.length} tickets`);
    setSelectedTickets([]);
    setSelectAll(false);
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
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{translateCategory(ticket.category)}</TableCell>
                  <TableCell>{renderPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{renderStatusBadge(ticket.status)}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${isSLACritical(ticket) ? 'text-red-600' : ''}`}>
                      {calculateSLARemaining(ticket)}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleString('es-ES', { 
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
