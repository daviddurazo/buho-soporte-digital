import React, { useState, useEffect } from 'react';
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
  FilePen,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TicketDetailDrawerProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({ 
  ticket, 
  isOpen, 
  onClose 
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status as TicketStatus);
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority>(ticket.priority as TicketPriority);
  
  // Reset states when new ticket is loaded
  useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status as TicketStatus);
      setSelectedPriority(ticket.priority as TicketPriority);
      setNewComment('');
    }
  }, [ticket]);
  
  // Fetch comments for this ticket
  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['ticketComments', ticket.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_comments')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!ticket.id
  });

  // Fetch history for this ticket
  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['ticketHistory', ticket.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_history')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!ticket.id
  });

  // Fetch attachments for this ticket
  const { data: attachments = [], isLoading: isLoadingAttachments } = useQuery({
    queryKey: ['ticketAttachments', ticket.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attachments')
        .select('*')
        .eq('ticket_id', ticket.id);

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!ticket.id
  });

  // Mutation for adding comment
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Usuario no autenticado');
      
      // Add comment
      const { error: commentError } = await supabase
        .from('ticket_comments')
        .insert({
          content: newComment,
          ticket_id: ticket.id,
          user_id: user.id
        });

      if (commentError) throw commentError;
      
      // Add history entry about comment
      const { error: historyError } = await supabase
        .from('ticket_history')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          action: 'Comentario añadido'
        });
        
      if (historyError) throw historyError;
    },
    onSuccess: () => {
      toast.success('Comentario añadido correctamente');
      setNewComment('');
      // Refresh comments and history data
      queryClient.invalidateQueries({ queryKey: ['ticketComments', ticket.id] });
      queryClient.invalidateQueries({ queryKey: ['ticketHistory', ticket.id] });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Error al añadir comentario');
    }
  });
  
  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: async (status: TicketStatus) => {
      if (!user) throw new Error('Usuario no autenticado');
      
      // Update ticket status
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticket.id);

      if (updateError) throw updateError;
      
      // Add history entry
      const { error: historyError } = await supabase
        .from('ticket_history')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          action: `Estado cambiado a "${translateStatus(status)}"`
        });
        
      if (historyError) throw historyError;
    },
    onSuccess: (_, status) => {
      toast.success(`Estado actualizado a: ${translateStatus(status)}`);
      // Refresh ticket data and history
      queryClient.invalidateQueries({ queryKey: ['technicianTickets'] });
      queryClient.invalidateQueries({ queryKey: ['assignedTickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketHistory', ticket.id] });
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado');
    }
  });
  
  // Mutation for updating priority
  const updatePriorityMutation = useMutation({
    mutationFn: async (priority: TicketPriority) => {
      if (!user) throw new Error('Usuario no autenticado');
      
      // Update ticket priority
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ 
          priority, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticket.id);
        
      if (updateError) throw updateError;
      
      // Add history entry
      const { error: historyError } = await supabase
        .from('ticket_history')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          action: `Prioridad cambiada a "${translatePriority(priority)}"`
        });
        
      if (historyError) throw historyError;
    },
    onSuccess: (_, priority) => {
      toast.success(`Prioridad actualizada a: ${translatePriority(priority)}`);
      // Refresh ticket data and history
      queryClient.invalidateQueries({ queryKey: ['technicianTickets'] });
      queryClient.invalidateQueries({ queryKey: ['assignedTickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketHistory', ticket.id] });
    },
    onError: (error) => {
      console.error('Error updating priority:', error);
      toast.error('Error al actualizar la prioridad');
    }
  });

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Por favor, ingrese un comentario');
      return;
    }
    
    addCommentMutation.mutate();
  };
  
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status as TicketStatus);
    updateStatusMutation.mutate(status as TicketStatus);
  };
  
  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority as TicketPriority);
    updatePriorityMutation.mutate(priority as TicketPriority);
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
            <span>{ticket.ticket_number}</span>
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
                <p>{new Date(ticket.created_at).toLocaleString('es-ES')}</p>
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
                  {ticket.due_date ? new Date(ticket.due_date).toLocaleString('es-ES') : 'No definido'}
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
              {isLoadingComments ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : comments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-2" />
                    <p>No hay comentarios aún</p>
                  </CardContent>
                </Card>
              ) : (
                comments.map((comment: Comment) => (
                  <Card key={comment.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Técnico</CardTitle>
                      <CardDescription className="text-xs">
                        {new Date(comment.created_at).toLocaleString('es-ES')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{comment.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  {isLoadingHistory ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <ListCheck className="h-12 w-12 mb-2" />
                      <p>No hay historial disponible</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {history.map((item: TicketHistory) => (
                        <li key={item.id} className="flex items-start gap-3">
                          <div className="rounded-full bg-[#E5DEFF] p-1">
                            <ListCheck className="h-4 w-4 text-[#6E59A5]" />
                          </div>
                          <div>
                            <p className="font-medium">{item.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.created_at).toLocaleString('es-ES')}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Attachments Tab */}
            <TabsContent value="attachments">
              <Card>
                <CardContent className="pt-6">
                  {isLoadingAttachments ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : attachments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mb-2" />
                      <p>No hay archivos adjuntos</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {attachments.map((attachment: Attachment) => (
                        <li key={attachment.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getFileIcon(attachment.mime_type)}
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
                  )}
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
          <Button 
            onClick={handleAddComment} 
            disabled={!newComment.trim() || addCommentMutation.isPending}
          >
            {addCommentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Añadiendo...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Añadir Comentario
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
