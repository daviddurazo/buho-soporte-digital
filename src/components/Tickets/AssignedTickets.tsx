
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { TicketDetailDrawer } from './TicketDetailDrawer';

type Ticket = {
  id: string;
  title: string;
  category: string;
  priority: 'baja' | 'media' | 'alta' | 'crítica';
  status: 'nuevo' | 'asignado' | 'en_progreso' | 'resuelto';
  slaRemaining: string;
  createdAt: string;
  creator: string;
  description: string;
};

export const AssignedTickets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Datos de ejemplo
  const tickets: Ticket[] = [
    {
      id: 'T-1001',
      title: 'Falla en proyector del aula B-12',
      category: 'Hardware',
      priority: 'alta',
      status: 'asignado',
      slaRemaining: '3h 45m',
      createdAt: '2023-06-03T08:30:00Z',
      creator: 'Juan Pérez (Profesor)',
      description: 'El proyector del aula B-12 no enciende. Ya revisé la conexión y el cable de alimentación parece estar bien.'
    },
    {
      id: 'T-1003',
      title: 'Error en carga de calificaciones',
      category: 'Software',
      priority: 'alta',
      status: 'en_progreso',
      slaRemaining: '2h 20m',
      createdAt: '2023-06-02T14:20:00Z',
      creator: 'Carlos Ruiz (Profesor)',
      description: 'No puedo cargar las calificaciones en el sistema, aparece un error cuando intento guardar los cambios.'
    },
    {
      id: 'T-1005',
      title: 'Servidor de bases de datos lento',
      category: 'Servidores',
      priority: 'crítica',
      status: 'en_progreso',
      slaRemaining: '1h 10m',
      createdAt: '2023-06-01T10:30:00Z',
      creator: 'Admin Sistema',
      description: 'El servidor de bases de datos está respondiendo muy lento, afectando a varios sistemas de la universidad.'
    },
    {
      id: 'T-1008',
      title: 'Problema con acceso al laboratorio',
      category: 'Accesos',
      priority: 'media',
      status: 'asignado',
      slaRemaining: '6h 30m',
      createdAt: '2023-06-04T09:15:00Z',
      creator: 'María López (Profesor)',
      description: 'No puedo acceder al laboratorio de química con mi credencial, el lector no la reconoce.'
    }
  ];

  // Filtrar tickets según los criterios de búsqueda y filtros
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchTerm === '' || 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.creator.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPriority = filterPriority === '' || ticket.priority === filterPriority;
    const matchesCategory = filterCategory === '' || ticket.category.toLowerCase() === filterCategory.toLowerCase();
    
    return matchesSearch && matchesPriority && matchesCategory;
  });
  
  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };
  
  const handleSelectTicket = (id: string) => {
    if (selectedTickets.includes(id)) {
      setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
    } else {
      setSelectedTickets([...selectedTickets, id]);
    }
  };
  
  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };
  
  const handleBulkAction = (action: string) => {
    if (selectedTickets.length === 0) {
      toast.error("No hay tickets seleccionados");
      return;
    }
    
    if (action === 'resolve') {
      toast.success(`${selectedTickets.length} tickets marcados como resueltos`);
      setSelectedTickets([]);
    } else if (action === 'inProgress') {
      toast.success(`${selectedTickets.length} tickets marcados como en progreso`);
      setSelectedTickets([]);
    } else if (action === 'reassign') {
      toast.success(`${selectedTickets.length} tickets preparados para reasignación`);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'baja':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Baja</Badge>;
      case 'media':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Media</Badge>;
      case 'alta':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Alta</Badge>;
      case 'crítica':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Crítica</Badge>;
      default:
        return <Badge variant="outline">Desconocida</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'nuevo':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Nuevo</Badge>;
      case 'asignado':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Asignado</Badge>;
      case 'en_progreso':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En Progreso</Badge>;
      case 'resuelto':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Resuelto</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Tickets Asignados</CardTitle>
              <CardDescription>
                Gestiona tus tickets asignados y su progreso
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedTickets.length > 0 && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('resolve')}
                  >
                    Resolver seleccionados
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('inProgress')}
                  >
                    Marcar en progreso
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('reassign')}
                  >
                    Reasignar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tickets..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    {filterPriority || "Prioridad"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    {filterCategory || "Categoría"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="servidores">Servidores</SelectItem>
                  <SelectItem value="redes">Redes</SelectItem>
                  <SelectItem value="accesos">Accesos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="hidden md:table-cell">Título</TableHead>
                  <TableHead className="hidden md:table-cell">Categoría</TableHead>
                  <TableHead className="hidden lg:table-cell">Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">SLA Restante</TableHead>
                  <TableHead className="hidden lg:table-cell">Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow 
                      key={ticket.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(ticket)}
                    >
                      <TableCell 
                        className="w-12"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox 
                          checked={selectedTickets.includes(ticket.id)}
                          onCheckedChange={() => handleSelectTicket(ticket.id)}
                          aria-label={`Select ticket ${ticket.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.category}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getPriorityBadge(ticket.priority)}
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className={`
                          ${ticket.slaRemaining.includes('1h') ? 'text-orange-500' : ''}
                          ${ticket.slaRemaining.includes('h') && !ticket.slaRemaining.includes('1h') ? 'text-yellow-500' : ''}
                        `}>{ticket.slaRemaining}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(ticket.createdAt).toLocaleDateString('es-MX')}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                            <DropdownMenuItem>Añadir nota</DropdownMenuItem>
                            <DropdownMenuItem>Reasignar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No se encontraron tickets que coincidan con los criterios de búsqueda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {selectedTicket && (
        <TicketDetailDrawer
          open={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          ticket={{
            id: selectedTicket.id,
            title: selectedTicket.title,
            status: selectedTicket.status,
            priority: selectedTicket.priority,
            category: selectedTicket.category,
            creator: {
              name: selectedTicket.creator,
              email: 'usuario@example.com',
              image: ''
            },
            assignedTo: {
              name: 'Técnico Asignado',
              email: 'tecnico@example.com',
              image: ''
            },
            createdAt: selectedTicket.createdAt,
            updatedAt: new Date().toISOString(),
            description: selectedTicket.description,
            history: [
              {
                id: '1',
                action: 'Ticket creado',
                timestamp: selectedTicket.createdAt,
                user: selectedTicket.creator
              },
              {
                id: '2',
                action: 'Ticket asignado a Técnico',
                timestamp: new Date(new Date(selectedTicket.createdAt).getTime() + 3600000).toISOString(),
                user: 'Sistema'
              },
              {
                id: '3',
                action: 'Estado cambiado a En Progreso',
                timestamp: new Date(new Date(selectedTicket.createdAt).getTime() + 7200000).toISOString(),
                user: 'Técnico Asignado'
              }
            ],
            comments: [
              {
                id: '1',
                content: 'He revisado el problema y estoy trabajando en ello.',
                timestamp: new Date(new Date(selectedTicket.createdAt).getTime() + 7200000).toISOString(),
                user: {
                  name: 'Técnico Asignado',
                  email: 'tecnico@example.com',
                  image: ''
                },
                isInternal: true
              }
            ],
            attachments: []
          }}
        />
      )}
    </>
  );
};
