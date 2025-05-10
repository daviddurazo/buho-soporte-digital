
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnisonLogo } from '@/components/UnisonLogo';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Calendar, Eye, Edit, CheckCircle } from 'lucide-react';

type Ticket = {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
};

const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // For demo purposes - in a real app, these would come from an API
  const statusOptions = ['all', 'nuevo', 'asignado', 'en progreso', 'resuelto'];
  const categoryOptions = ['all', 'wifi', 'software', 'hardware', 'servidor', 'cuenta', 'otro'];

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be an API call
    const mockTickets: Ticket[] = [
      {
        id: 'TIC-001',
        title: 'WiFi no funciona en Biblioteca Central',
        category: 'wifi',
        status: 'nuevo',
        priority: 'alta',
        creator: { firstName: 'Juan', lastName: 'Pérez', email: 'juan@unison.mx' },
        createdAt: '2025-05-01T08:30:00Z',
      },
      {
        id: 'TIC-002',
        title: 'Error al iniciar sesión en plataforma educativa',
        category: 'cuenta',
        status: 'en progreso',
        priority: 'media',
        creator: { firstName: 'María', lastName: 'García', email: 'maria@unison.mx' },
        createdAt: '2025-05-02T10:15:00Z',
      },
      {
        id: 'TIC-003',
        title: 'Proyector no enciende en aula 210',
        category: 'hardware',
        status: 'asignado',
        priority: 'alta',
        creator: { firstName: 'Carlos', lastName: 'López', email: 'carlos@unison.mx' },
        createdAt: '2025-05-03T09:45:00Z',
      },
      {
        id: 'TIC-004',
        title: 'Actualización de software requerida',
        category: 'software',
        status: 'resuelto',
        priority: 'baja',
        creator: { firstName: 'Ana', lastName: 'Martínez', email: 'ana@unison.mx' },
        createdAt: '2025-05-04T14:20:00Z',
      },
      {
        id: 'TIC-005',
        title: 'Problema con servidor de correo',
        category: 'servidor',
        status: 'en progreso',
        priority: 'crítica',
        creator: { firstName: 'Roberto', lastName: 'Sánchez', email: 'roberto@unison.mx' },
        createdAt: '2025-05-05T11:10:00Z',
      },
    ];
    
    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
    setLoading(false);
  }, []);

  // Filter tickets based on search text, status, and category
  useEffect(() => {
    let result = [...tickets];
    
    if (searchText.trim() !== '') {
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchText.toLowerCase()) ||
        ticket.creator.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(ticket => ticket.category === categoryFilter);
    }
    
    setFilteredTickets(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchText, statusFilter, categoryFilter, tickets]);

  // Check if user is authenticated and has the right role
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
      
      if (user && user.role !== 'admin' && user.role !== 'technician') {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para acceder a esta página",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, toast]);

  // Get current tickets for pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    // In a real app, this would be an API call
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
    
    toast({
      title: "Estado actualizado",
      description: `Ticket ${ticketId} ahora está ${newStatus}`,
      variant: "default",
    });
  };

  const handleAssignTicket = (ticketId: string) => {
    // In a real app, this would open an assignment dialog and make an API call
    toast({
      title: "Ticket asignado",
      description: `Ticket ${ticketId} ha sido asignado a ti`,
      variant: "default",
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unison-blue"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <UnisonLogo size="sm" className="mr-4" />
          <h1 className="text-2xl font-bold text-gray-800">Gestionar Tickets</h1>
        </div>
        <Button 
          onClick={() => navigate('/tickets/new')}
          className="bg-unison-blue hover:bg-blue-700"
        >
          Nuevo Ticket
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por ID, título o solicitante..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Lista de tickets de soporte</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No se encontraron tickets con los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                currentTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell className="capitalize">{ticket.category}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${ticket.status === 'nuevo' ? 'bg-blue-100 text-blue-800' : ''}
                        ${ticket.status === 'asignado' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${ticket.status === 'en progreso' ? 'bg-purple-100 text-purple-800' : ''}
                        ${ticket.status === 'resuelto' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${ticket.priority === 'baja' ? 'bg-gray-100 text-gray-800' : ''}
                        ${ticket.priority === 'media' ? 'bg-blue-100 text-blue-800' : ''}
                        ${ticket.priority === 'alta' ? 'bg-orange-100 text-orange-800' : ''}
                        ${ticket.priority === 'crítica' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{`${ticket.creator.firstName} ${ticket.creator.lastName}`}</TableCell>
                    <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAssignTicket(ticket.id)}
                          className="h-8 w-8 p-0"
                          title="Asignar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(ticket)}
                          className="h-8 w-8 p-0"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(ticket.id, 'resuelto')}
                          className="h-8 w-8 p-0"
                          title="Marcar como resuelto"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Ticket Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Ticket #{selectedTicket?.id}</DialogTitle>
            <DialogDescription>
              Creado por {selectedTicket?.creator.firstName} {selectedTicket?.creator.lastName} ({selectedTicket?.creator.email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedTicket?.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
                ${selectedTicket?.status === 'nuevo' ? 'bg-blue-100 text-blue-800' : ''}
                ${selectedTicket?.status === 'asignado' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${selectedTicket?.status === 'en progreso' ? 'bg-purple-100 text-purple-800' : ''}
                ${selectedTicket?.status === 'resuelto' ? 'bg-green-100 text-green-800' : ''}
              `}>
                {selectedTicket?.status.charAt(0).toUpperCase() + selectedTicket?.status.slice(1)}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-700">
                Este es un placeholder para la descripción del ticket. En una implementación real,
                aquí se mostraría el contenido completo del ticket junto con la línea de tiempo,
                comentarios y archivos adjuntos.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Categoría:</span> {selectedTicket?.category}
              </div>
              <div>
                <span className="font-medium">Prioridad:</span> {selectedTicket?.priority}
              </div>
              <div>
                <span className="font-medium">Fecha de creación:</span> {selectedTicket && formatDate(selectedTicket.createdAt)}
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Cambiar estado</h4>
              <div className="flex gap-2">
                {['nuevo', 'asignado', 'en progreso', 'resuelto'].map((status) => (
                  <Button 
                    key={status}
                    variant={selectedTicket?.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectedTicket && handleStatusChange(selectedTicket.id, status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsPage;
