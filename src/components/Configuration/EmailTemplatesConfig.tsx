
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Email template type definition
type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  createdAt: string;
  updatedAt: string;
};

// Mock data for email templates
const initialEmailTemplates: EmailTemplate[] = [
  {
    id: "email-1",
    name: "Nuevo Ticket",
    subject: "Ticket #{ticketId} - Confirmación de recepción",
    body: `
<h2>Estimado/a {userName},</h2>

<p>Hemos recibido su solicitud de soporte técnico con el siguiente detalle:</p>

<ul>
  <li><strong>Ticket ID:</strong> #{ticketId}</li>
  <li><strong>Asunto:</strong> {ticketTitle}</li>
  <li><strong>Categoría:</strong> {ticketCategory}</li>
  <li><strong>Fecha de creación:</strong> {creationDate}</li>
</ul>

<p>Un técnico revisará su solicitud lo antes posible. Puede consultar el estado de su ticket en cualquier momento a través del portal de soporte.</p>

<p>Atentamente,<br>
El equipo de Soporte Técnico<br>
Universidad de Sonora</p>
    `,
    type: "notification",
    createdAt: "2023-01-15",
    updatedAt: "2023-01-15"
  },
  {
    id: "email-2",
    name: "Ticket Asignado",
    subject: "Ticket #{ticketId} - Asignación a técnico",
    body: `
<h2>Estimado/a {userName},</h2>

<p>Su solicitud de soporte técnico ha sido asignada a un técnico y está siendo procesada:</p>

<ul>
  <li><strong>Ticket ID:</strong> #{ticketId}</li>
  <li><strong>Asunto:</strong> {ticketTitle}</li>
  <li><strong>Técnico asignado:</strong> {technicianName}</li>
  <li><strong>Tiempo estimado de resolución:</strong> {estimatedTime}</li>
</ul>

<p>El técnico podría contactarle para solicitar información adicional. Su ticket será atendido según los acuerdos de nivel de servicio establecidos.</p>

<p>Atentamente,<br>
El equipo de Soporte Técnico<br>
Universidad de Sonora</p>
    `,
    type: "update",
    createdAt: "2023-01-16",
    updatedAt: "2023-01-16"
  },
  {
    id: "email-3",
    name: "Ticket Resuelto",
    subject: "Ticket #{ticketId} - Resolución de incidencia",
    body: `
<h2>Estimado/a {userName},</h2>

<p>Nos complace informarle que su solicitud de soporte ha sido resuelta:</p>

<ul>
  <li><strong>Ticket ID:</strong> #{ticketId}</li>
  <li><strong>Asunto:</strong> {ticketTitle}</li>
  <li><strong>Solución:</strong> {resolution}</li>
  <li><strong>Fecha de resolución:</strong> {resolutionDate}</li>
</ul>

<p>Si considera que el problema no ha sido resuelto satisfactoriamente, puede reabrirlo respondiendo a este correo o a través del portal de soporte en un plazo de 3 días.</p>

<p>Le invitamos a completar una breve encuesta de satisfacción para ayudarnos a mejorar nuestro servicio: [Link a encuesta]</p>

<p>Atentamente,<br>
El equipo de Soporte Técnico<br>
Universidad de Sonora</p>
    `,
    type: "resolution",
    createdAt: "2023-01-17",
    updatedAt: "2023-01-18"
  },
];

const EmailTemplatesConfig = () => {
  const { toast } = useToast();
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(initialEmailTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const [newTemplate, setNewTemplate] = useState<Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>>({
    name: "",
    subject: "",
    body: "",
    type: "notification",
  });

  const [activeTab, setActiveTab] = useState<string>("edit");

  // Filter email templates based on search term
  const filteredTemplates = emailTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.subject && newTemplate.body) {
      if (editingTemplate) {
        // Update existing template
        setEmailTemplates(emailTemplates.map(template => 
          template.id === editingTemplate.id ? {
            ...template,
            name: newTemplate.name,
            subject: newTemplate.subject,
            body: newTemplate.body,
            type: newTemplate.type,
            updatedAt: new Date().toISOString().split('T')[0],
          } : template
        ));
        toast({
          title: "Plantilla actualizada",
          description: `La plantilla ${newTemplate.name} ha sido actualizada exitosamente.`,
        });
      } else {
        // Add new template
        const newId = `email-${Date.now()}`;
        const today = new Date().toISOString().split('T')[0];
        setEmailTemplates([...emailTemplates, {
          id: newId,
          name: newTemplate.name,
          subject: newTemplate.subject,
          body: newTemplate.body,
          type: newTemplate.type,
          createdAt: today,
          updatedAt: today,
        }]);
        toast({
          title: "Plantilla creada",
          description: `La plantilla ${newTemplate.name} ha sido creada exitosamente.`,
        });
      }
      
      setNewTemplate({
        name: "",
        subject: "",
        body: "",
        type: "notification",
      });
      setEditingTemplate(null);
      setOpenDialog(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todos los campos son obligatorios.",
      });
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type,
    });
    setActiveTab("edit");
    setOpenDialog(true);
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setPreviewDialog(true);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar esta plantilla?")) {
      setEmailTemplates(emailTemplates.filter(template => template.id !== id));
      toast({
        title: "Plantilla eliminada",
        description: "La plantilla ha sido eliminada exitosamente.",
      });
    }
  };

  const templateTypes = ["notification", "update", "resolution", "reminder", "escalation"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          <Input
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Nueva Plantilla
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "Editar Plantilla de Correo" : "Nueva Plantilla de Correo"}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="edit">Editar</TabsTrigger>
                  <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                    <Input
                      id="name"
                      placeholder="Nombre de la plantilla"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">Tipo</label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newTemplate.type}
                      onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
                    >
                      {templateTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="subject" className="text-sm font-medium">Asunto</label>
                    <Input
                      id="subject"
                      placeholder="Asunto del correo"
                      value={newTemplate.subject}
                      onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="body" className="text-sm font-medium">Cuerpo del Correo (HTML)</label>
                    <div className="border rounded-md">
                      <div className="flex border-b p-2 bg-gray-50">
                        <button 
                          className="px-2 py-1 hover:bg-gray-200 rounded" 
                          onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + "<strong></strong>"})}
                          type="button"
                        >
                          B
                        </button>
                        <button 
                          className="px-2 py-1 hover:bg-gray-200 rounded" 
                          onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + "<em></em>"})}
                          type="button"
                        >
                          I
                        </button>
                        <button 
                          className="px-2 py-1 hover:bg-gray-200 rounded" 
                          onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + "<a href=\"\"></a>"})}
                          type="button"
                        >
                          Link
                        </button>
                        <button 
                          className="px-2 py-1 hover:bg-gray-200 rounded" 
                          onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + "<h2></h2>"})}
                          type="button"
                        >
                          H2
                        </button>
                        <button 
                          className="px-2 py-1 hover:bg-gray-200 rounded" 
                          onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + "<ul>\n  <li></li>\n</ul>"})}
                          type="button"
                        >
                          List
                        </button>
                        <button 
                          className="px-2 py-1 hover:bg-gray-200 rounded" 
                          onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + "{variable}"})}
                          type="button"
                        >
                          Variable
                        </button>
                      </div>
                      <Textarea
                        id="body"
                        placeholder="Contenido HTML del correo"
                        value={newTemplate.body}
                        onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                        className="min-h-[300px] font-mono text-sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Variables disponibles: {"{userName}"}, {"{ticketId}"}, {"{ticketTitle}"}, {"{ticketCategory}"}, 
                      {"{creationDate}"}, {"{technicianName}"}, {"{estimatedTime}"}, {"{resolution}"}, {"{resolutionDate}"}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview">
                  <div className="border rounded-md p-4">
                    <div className="p-2 mb-4 bg-gray-50 border rounded">
                      <strong>Asunto:</strong> {newTemplate.subject}
                    </div>
                    <div 
                      className="prose max-w-full" 
                      dangerouslySetInnerHTML={{ 
                        __html: newTemplate.body
                          .replace(/{userName}/g, "Juan Pérez")
                          .replace(/{ticketId}/g, "12345")
                          .replace(/{ticketTitle}/g, "Problemas con el acceso al WiFi")
                          .replace(/{ticketCategory}/g, "WiFi Campus")
                          .replace(/{creationDate}/g, "2023-05-10")
                          .replace(/{technicianName}/g, "Carlos Gómez")
                          .replace(/{estimatedTime}/g, "4 horas")
                          .replace(/{resolution}/g, "Se reconfiguró el punto de acceso WiFi")
                          .replace(/{resolutionDate}/g, "2023-05-11")
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpenDialog(false);
                  setEditingTemplate(null);
                  setNewTemplate({
                    name: "",
                    subject: "",
                    body: "",
                    type: "notification",
                  });
                }}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleAddTemplate}>
                  {editingTemplate ? "Guardar Cambios" : "Crear Plantilla"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Asunto</TableHead>
              <TableHead className="hidden md:table-cell">Actualizado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${template.type === 'notification' ? 'bg-blue-100 text-blue-800' : ''}
                      ${template.type === 'update' ? 'bg-green-100 text-green-800' : ''}
                      ${template.type === 'resolution' ? 'bg-purple-100 text-purple-800' : ''}
                      ${template.type === 'reminder' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${template.type === 'escalation' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{template.subject}</TableCell>
                  <TableCell className="hidden md:table-cell">{template.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePreviewTemplate(template)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No se encontraron plantillas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Vista Previa: {editingTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="border rounded-md p-4 mt-4">
            <div className="p-2 mb-4 bg-gray-50 border rounded">
              <strong>Asunto:</strong> {editingTemplate?.subject}
            </div>
            {editingTemplate && (
              <div 
                className="prose max-w-full" 
                dangerouslySetInnerHTML={{ 
                  __html: editingTemplate.body
                    .replace(/{userName}/g, "Juan Pérez")
                    .replace(/{ticketId}/g, "12345")
                    .replace(/{ticketTitle}/g, "Problemas con el acceso al WiFi")
                    .replace(/{ticketCategory}/g, "WiFi Campus")
                    .replace(/{creationDate}/g, "2023-05-10")
                    .replace(/{technicianName}/g, "Carlos Gómez")
                    .replace(/{estimatedTime}/g, "4 horas")
                    .replace(/{resolution}/g, "Se reconfiguró el punto de acceso WiFi")
                    .replace(/{resolutionDate}/g, "2023-05-11")
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplatesConfig;
