import React, { useState } from 'react';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Ticket, 
  translateStatus, 
  translatePriority, 
  translateCategory, 
  Comment, 
  TicketHistory, 
  TicketStatus, 
  TicketPriority, 
  Attachment 
} from '@/types';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Clock, 
  Flag,
  FileText,
  ListCheck,
  Check,
  X,
  FileImage,
  FileCode,
  FilePen
} from 'lucide-react';

// Add at the top of the file
import { Ticket } from '@/types';

interface TicketDetailDrawerProps {
  ticket: Ticket & { dueDate: string }; // This ensures dueDate is required in this component
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for comments
const mockComments: Comment[] = [
  {
    id: 'comment-1',
    content: 'He revisado el problema y parece ser un tema de permisos de acceso. Trabajando en ello.',
    createdAt: '2025-05-01T14:15:00Z',
    ticketId: 'TK-1001',
    userId: 'tech-001'
  },
  {
    id: 'comment-2',
    content: '¿Ha intentado restablecer su contraseña usando el portal de autoservicio?',
    createdAt: '2025-05-01T14:20:00Z',
    ticketId: 'TK-1001',
    userId: 'tech-001'
  }
];

// Mock data for ticket history
const mockHistory: TicketHistory[] = [
  {
    id: 'history-1',
    action: 'Ticket creado por usuario',
    createdAt: '2025-05-01T10:30:00Z',
    ticketId: 'TK-1001',
    userId: 'user-123'
  },
  {
    id: 'history-2',
    action: 'Ticket asignado a técnico',
    createdAt: '2025-05-01T11:45:00Z',
    ticketId: 'TK-1001',
    userId: 'admin-001'
  },
  {
    id: 'history-3',
    action: 'Estado cambiado a "En progreso"',
    createdAt: '2025-05-01T14:10:00Z',
    ticketId: 'TK-1001',
    userId: 'tech-001'
  }
];

// Mock data for attachments
const mockAttachments: Attachment[] = [
  {
    id: 'attach-1',
    filename: 'error_screenshot.png',
    path: '/uploads/error_screenshot.png',
    mimeType: 'image/png',
    size: 124500,
    createdAt: '2025-05-01T10:30:00Z',
    ticketId: 'TK-1001'
  },
  {
    id: 'attach-2',
    filename: 'log_file.txt',
    path: '/uploads/log_file.txt',
    mimeType: 'text/plain',
    size: 5200,
    createdAt: '2025-05-01T14:20:00Z',
    ticketId: 'TK-1001'
  }
];

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({ 
  ticket, 
  isOpen, 
  onClose 
}) => {
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | ''>('');
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority | ''>('');
  
  // Reset states when new ticket is loaded
  React.useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status);
      setSelectedPriority(ticket.priority);
      setNewComment('');
    }
  }, [ticket]);
  
  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Por favor, ingrese un comentario');
      return;
    }
    
    // In a real app, this would make an API call
    toast.success('Comentario añadido correctamente');
    setNewComment('');
  };
  
  const handleStatusChange = (status: string) => {
    // In a real app, this would make an API call
    toast.success(`Estado actualizado a: ${translateStatus(status as TicketStatus)}`);
    setSelectedStatus(status as TicketStatus);
  };
  
  const handlePriorityChange = (priority: string) => {
    // In a real app, this would make an API call
    toast.success(`Prioridad actualizada a: ${translatePriority(priority as TicketPriority)}`);
    setSelectedPriority(priority as TicketPriority);
  };

  // Render file icon based on mimetype
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />;
    } else if (mimeType === 'text/plain' || mimeType === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    } else if (mimeType === 'application/json' || mimeType.includes('javascript')) {
      return <FileCode className="h-4 w-4" />;
    } else {
      return <FilePen className="h-4 w-4" />;
    }
  };
  
  // Format file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  if (!ticket) {
    return null;
  }
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <span>{ticket.id}</span>
            {selectedStatus && (
              <Badge className={
                selectedStatus === 'nuevo' ? 'bg-purple-500 text-white' :
                selectedStatus === 'asignado' ? 'bg-blue-500 text-white' :
                selectedStatus === 'en_progreso' ? 'bg-yellow-500 text-black' :
                selectedStatus === 'resuelto' ? 'bg-green-500 text-white' :
                'bg-gray-500 text-white'
              }>
                {translateStatus(selectedStatus)}
              </Badge>
            )}
          </DrawerTitle>
          <DrawerDescription className="text-lg font-medium text-black">
            {ticket.title}
          </DrawerDescription>
        </DrawerHeader>
        
        {/* Main content */}
        <div className="px-4 overflow-auto max-h-[calc(80vh-180px)]">
          {/* Ticket details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{translateCategory(ticket.category)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Prioridad</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Flag className={`h-4 w-4 ${
                  selectedPriority === 'crítica' ? 'text-red-500' : 
                  selectedPriority === 'alta' ? 'text-orange-500' : 
                  selectedPriority === 'media' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />
                <span>{selectedPriority ? translatePriority(selectedPriority) : 'No definida'}</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Fecha de Creación</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{new Date(ticket.createdAt).toLocaleString('es-ES')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  SLA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={ticket.priority === 'crítica' || ticket.priority === 'alta' ? 'text-red-500 font-medium' : ''}>
                  {/* This would be calculated dynamically in a real app */}
                  {ticket.priority === 'crítica' ? '4 horas' : 
                   ticket.priority === 'alta' ? '8 horas' : 
                   ticket.priority === 'media' ? '24 horas' : 
                   '48 horas'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{ticket.description}</p>
            </CardContent>
          </Card>
          
          {/* Tabs for History, Comments, and Attachments */}
          <Tabs defaultValue="comments">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="comments">Comentarios</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
              <TabsTrigger value="attachments">Adjuntos</TabsTrigger>
            </TabsList>
            
            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-4">
              {mockComments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Técnico</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(comment.createdAt).toLocaleString('es-ES')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {mockHistory.map((item) => (
                      <li key={item.id} className="flex items-start gap-3">
                        <div className="rounded-full bg-[#E5DEFF] p-1">
                          <ListCheck className="h-4 w-4 text-[#6E59A5]" />
                        </div>
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Attachments Tab */}
            <TabsContent value="attachments">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {mockAttachments.map((attachment) => (
                      <li key={attachment.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(attachment.mimeType)}
                          <span>{attachment.filename}</span>
                          <span className="text-sm text-muted-foreground">
                            ({formatFileSize(attachment.size)})
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Descargar
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator className="my-4" />
        
        {/* Actions section */}
        <div className="px-4 pb-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Cambiar estado
              </label>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="asignado">Asignado</SelectItem>
                  <SelectItem value="en_progreso">En progreso</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Cambiar prioridad
              </label>
              <Select value={selectedPriority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crítica">Crítica</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Añadir comentario</label>
            <Textarea
              placeholder="Escribe un comentario o nota interna..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DrawerFooter>
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Añadir Comentario
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
