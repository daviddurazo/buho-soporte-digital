import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock,
  Tag,
  AlertCircle,
  CheckCircle,
  RotateCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TicketDetailDrawer } from './TicketDetailDrawer';
import { Ticket, TicketPriority, TicketStatus } from '@/types';

// Updated mock data for tickets with proper types
const mockAssignedTickets: Array<Ticket & { dueDate: string }> = [
  {
    id: 'TK-1001',
    title: 'Problema con la impresora',
    description: 'La impresora del departamento de ingeniería no está funcionando correctamente.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'en_progreso',
    priority: 'alta',
    category: 'hardware',
    userId: 'user123',
    assignedToId: 'tech001',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    creatorId: 'user123'
  },
  {
    id: 'TK-1002',
    title: 'Actualización de software necesaria',
    description: 'Necesitamos actualizar el software en los laboratorios.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    status: 'nuevo',
    priority: 'media',
    category: 'software',
    userId: 'user456',
    assignedToId: 'tech001',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    creatorId: 'user456'
  },
  {
    id: 'TK-1003',
    title: 'Problema de red en aula 105',
    description: 'Los estudiantes no pueden conectarse a la red WiFi en el aula 105.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'asignado',
    priority: 'alta',
    category: 'network',
    userId: 'user789',
    assignedToId: 'tech001',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    creatorId: 'user789'
  },
  {
    id: 'TK-1004',
    title: 'Acceso al sistema académico',
    description: 'No puedo acceder al sistema académico con mis credenciales.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    status: 'nuevo',
    priority: 'baja',
    category: 'access',
    userId: 'user101',
    assignedToId: 'tech001',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    creatorId: 'user101'
  },
  {
    id: 'TK-1005',
    title: 'Proyector no funciona en salón 303',
    description: 'El proyector del salón 303 no está encendiendo.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    status: 'en_progreso',
    priority: 'media',
    category: 'hardware',
    userId: 'user202',
    assignedToId: 'tech001',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    creatorId: 'user202'
  }
];

const getPriorityBadge = (priority: TicketPriority) => {
  switch (priority) {
    case 'alta':
      return <Badge variant="destructive">Alta</Badge>;
    case 'media':
      return <Badge variant="default" className="bg-yellow-500">Media</Badge>;
    case 'baja':
      return <Badge variant="outline" className="text-gray-500">Baja</Badge>;
    case 'crítica':
      return <Badge variant="destructive" className="bg-red-600">Crítica</Badge>;
    default:
      return <Badge variant="outline">N/A</Badge>;
  }
};

const getStatusBadge = (status: TicketStatus) => {
  switch (status) {
    case 'nuevo':
      return <Badge variant="secondary">Abierto</Badge>;
    case 'en_progreso':
      return <Badge className="bg-blue-500">En Progreso</Badge>;
    case 'asignado':
      return <Badge className="bg-yellow-500">Pendiente</Badge>;
    case 'resuelto':
      return <Badge className="bg-green-500">Resuelto</Badge>;
    case 'cerrado':
      return <Badge variant="outline">Cerrado</Badge>;
    default:
      return <Badge variant="outline">N/A</Badge>;
  }
};

const getSLARemaining = (dueDate: string) => {
  const due = new Date(dueDate);
  const now = new Date();
  const remaining = due.getTime() - now.getTime();
  
  if (remaining < 0) {
    return (
      <span className="text-red-500 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1" /> Vencido
      </span>
    );
  }
  
  if (remaining < 1000 * 60 * 60 * 4) { // less than 4 hours
    return (
      <span className="text-red-500 flex items-center">
        <Clock className="h-4 w-4 mr-1" /> {formatDistanceToNow(due, { locale: es, addSuffix: true })}
      </span>
    );
  }
  
  if (remaining < 1000 * 60 * 60 * 24) { // less than 1 day
    return (
      <span className="text-yellow-500 flex items-center">
        <Clock className="h-4 w-4 mr-1" /> {formatDistanceToNow(due, { locale: es, addSuffix: true })}
      </span>
    );
  }
  
  return (
    <span className="text-green-500 flex items-center">
      <Clock className="h-4 w-4 mr-1" /> {formatDistanceToNow(due, { locale: es, addSuffix: true })}
    </span>
  );
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'hardware':
      return 'Hardware';
    case 'software':
      return 'Software';
    case 'network':
      return 'Red';
    case 'access':
      return 'Acceso';
    default:
      return 'Otro';
  }
};

export const AssignedTickets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket & { dueDate: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter tickets based on search query and filters
  const filteredTickets = mockAssignedTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const toggleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const handleViewTicket = (ticket: typeof mockAssignedTickets[0]) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const handleTicketAction = (action: string, ticketId?: string) => {
    const ticketsToAction = ticketId ? [ticketId] : selectedTickets;
    
    switch (action) {
      case 'changeStatus':
        toast.success(`Estado actualizado para ${ticketsToAction.length} ticket(s)`);
        break;
      case 'addNote':
        toast.success('Nota añadida correctamente');
        break;
      case 'reassign':
        toast.success(`${ticketsToAction.length} ticket(s) reasignado(s) correctamente`);
        break;
      case 'resolve':
        toast.success(`${ticketsToAction.length} ticket(s) marcado(s) como resueltos`);
        break;
      default:
        break;
    }
    
    // Reset selected tickets after bulk action
    if (!ticketId) {
      setSelectedTickets([]);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label htmlFor="search" className="text-sm font-medium">Buscar tickets</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por ID o título..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-48 space-y-1">
              <label htmlFor="priority-filter" className="text-sm font-medium">Prioridad</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="Filtrar por prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48 space-y-1">
              <label htmlFor="category-filter" className="text-sm font-medium">Categoría</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="network">Red</SelectItem>
                  <SelectItem value="access">Acceso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="md:self-end" onClick={() => {
              setSearchQuery('');
              setPriorityFilter('all');
              setCategoryFilter('all');
            }}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Bulk Actions */}
      {selectedTickets.length > 0 && (
        <div className="bg-muted p-3 rounded-md flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">{selectedTickets.length}</span> ticket(s) seleccionado(s)
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleTicketAction('changeStatus')}>
              Cambiar Estado
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleTicketAction('reassign')}>
              Reasignar
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleTicketAction('resolve')}>
              Marcar como Resuelto
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelectedTickets([])}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
      
      {/* Tickets Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Categoría</TableHead>
              <TableHead className="hidden md:table-cell">Prioridad</TableHead>
              <TableHead className="hidden md:table-cell">Estado</TableHead>
              <TableHead className="hidden md:table-cell">SLA Restante</TableHead>
              <TableHead className="hidden md:table-cell">Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Tag className="h-12 w-12 mb-2" />
                    <p className="text-lg font-medium">No hay tickets asignados</p>
                    <p className="text-sm">No se encontraron tickets que coincidan con los filtros aplicados</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewTicket(ticket)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedTickets.includes(ticket.id)} 
                      onCheckedChange={() => toggleSelectTicket(ticket.id)}
                      aria-label={`Seleccionar ticket ${ticket.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{ticket.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{ticket.title}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      {getCategoryLabel(ticket.category)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getPriorityBadge(ticket.priority)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getStatusBadge(ticket.status)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getSLARemaining(ticket.dueDate)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleTicketAction('changeStatus', ticket.id)}>
                          <RotateCw className="mr-2 h-4 w-4" />
                          Cambiar Estado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTicketAction('addNote', ticket.id)}>
                          <RotateCw className="mr-2 h-4 w-4" />
                          Añadir Nota
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTicketAction('reassign', ticket.id)}>
                          <RotateCw className="mr-2 h-4 w-4" />
                          Reasignar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleTicketAction('resolve', ticket.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como Resuelto
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Ticket Detail Drawer */}
      {selectedTicket && (
        <TicketDetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};
