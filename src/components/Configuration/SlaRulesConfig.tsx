
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, Plus, Pencil, Trash2, Clock } from "lucide-react";

// SLA Rule type definition
type SlaRule = {
  id: string;
  name: string;
  category: string;
  priority: string;
  responseTime: number; // in hours
  resolutionTime: number; // in hours
  escalation: string;
  createdAt: string;
};

// Mock data for SLA rules
const initialSlaRules: SlaRule[] = [
  {
    id: "sla-1",
    name: "WiFi Crítico",
    category: "wifi_campus",
    priority: "alta",
    responseTime: 1,
    resolutionTime: 4,
    escalation: "manager@unison.mx",
    createdAt: "2023-01-15"
  },
  {
    id: "sla-2",
    name: "Biblioteca Estándar",
    category: "acceso_biblioteca",
    priority: "media",
    responseTime: 4,
    resolutionTime: 24,
    escalation: "library@unison.mx",
    createdAt: "2023-01-16"
  },
  {
    id: "sla-3",
    name: "Hardware Urgente",
    category: "hardware",
    priority: "crítica",
    responseTime: 0.5,
    resolutionTime: 2,
    escalation: "tech@unison.mx",
    createdAt: "2023-01-17"
  },
  {
    id: "sla-4",
    name: "Software Baja Prioridad",
    category: "software",
    priority: "baja",
    responseTime: 8,
    resolutionTime: 48,
    escalation: "support@unison.mx",
    createdAt: "2023-01-18"
  },
];

const SlaRulesConfig = () => {
  const { toast } = useToast();
  const [slaRules, setSlaRules] = useState<SlaRule[]>(initialSlaRules);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSla, setEditingSla] = useState<SlaRule | null>(null);

  const [newSla, setNewSla] = useState<Omit<SlaRule, 'id' | 'createdAt'>>({
    name: "",
    category: "",
    priority: "media",
    responseTime: 4,
    resolutionTime: 24,
    escalation: "",
  });

  // Filter SLA rules based on search term
  const filteredSlaRules = slaRules.filter(sla => 
    sla.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sla.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sla.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSla = () => {
    if (newSla.name && newSla.category && newSla.priority) {
      if (editingSla) {
        // Update existing SLA rule
        setSlaRules(slaRules.map(sla => 
          sla.id === editingSla.id ? {
            ...sla,
            name: newSla.name,
            category: newSla.category,
            priority: newSla.priority,
            responseTime: newSla.responseTime,
            resolutionTime: newSla.resolutionTime,
            escalation: newSla.escalation,
          } : sla
        ));
        toast({
          title: "Regla SLA actualizada",
          description: `La regla SLA ${newSla.name} ha sido actualizada exitosamente.`,
        });
      } else {
        // Add new SLA rule
        const newId = `sla-${Date.now()}`;
        setSlaRules([...slaRules, {
          id: newId,
          name: newSla.name,
          category: newSla.category,
          priority: newSla.priority,
          responseTime: newSla.responseTime,
          resolutionTime: newSla.resolutionTime,
          escalation: newSla.escalation,
          createdAt: new Date().toISOString().split('T')[0],
        }]);
        toast({
          title: "Regla SLA creada",
          description: `La regla SLA ${newSla.name} ha sido creada exitosamente.`,
        });
      }
      
      setNewSla({
        name: "",
        category: "",
        priority: "media",
        responseTime: 4,
        resolutionTime: 24,
        escalation: "",
      });
      setEditingSla(null);
      setOpenDialog(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre, la categoría y la prioridad son obligatorios.",
      });
    }
  };

  const handleEditSla = (sla: SlaRule) => {
    setEditingSla(sla);
    setNewSla({
      name: sla.name,
      category: sla.category,
      priority: sla.priority,
      responseTime: sla.responseTime,
      resolutionTime: sla.resolutionTime,
      escalation: sla.escalation,
    });
    setOpenDialog(true);
  };

  const handleDeleteSla = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar esta regla SLA?")) {
      setSlaRules(slaRules.filter(sla => sla.id !== id));
      toast({
        title: "Regla SLA eliminada",
        description: "La regla SLA ha sido eliminada exitosamente.",
      });
    }
  };

  const handleImportCSV = () => {
    toast({
      title: "Importación iniciada",
      description: "Funcionalidad de importación CSV pendiente de implementación.",
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "Exportación iniciada",
      description: "Exportando reglas SLA a CSV...",
    });
    
    // Simple CSV export logic
    const csvContent = [
      ["id", "name", "category", "priority", "responseTime", "resolutionTime", "escalation", "createdAt"],
      ...slaRules.map(sla => [
        sla.id,
        sla.name,
        sla.category,
        sla.priority,
        sla.responseTime,
        sla.resolutionTime,
        sla.escalation,
        sla.createdAt
      ])
    ]
      .map(e => e.join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sla_rules.csv");
    link.click();
  };

  const categories = ["wifi_campus", "acceso_biblioteca", "problemas_lms", 
                     "correo_institucional", "hardware", "software", "redes", "servidores"];
  const priorities = ["baja", "media", "alta", "crítica"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Button onClick={handleImportCSV} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" /> Importar CSV
          </Button>
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Exportar CSV
          </Button>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Input
            placeholder="Buscar reglas SLA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Nueva Regla SLA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSla ? "Editar Regla SLA" : "Nueva Regla SLA"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                  <Input
                    id="name"
                    placeholder="Nombre de la regla SLA"
                    value={newSla.name}
                    onChange={(e) => setNewSla({...newSla, name: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">Categoría</label>
                  <Select 
                    value={newSla.category} 
                    onValueChange={(value) => setNewSla({...newSla, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="priority" className="text-sm font-medium">Prioridad</label>
                  <Select 
                    value={newSla.priority} 
                    onValueChange={(value) => setNewSla({...newSla, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="responseTime" className="text-sm font-medium">Tiempo de Respuesta (horas)</label>
                    <Input
                      id="responseTime"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={newSla.responseTime}
                      onChange={(e) => setNewSla({...newSla, responseTime: parseFloat(e.target.value)})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="resolutionTime" className="text-sm font-medium">Tiempo de Resolución (horas)</label>
                    <Input
                      id="resolutionTime"
                      type="number"
                      min="1"
                      step="0.5"
                      value={newSla.resolutionTime}
                      onChange={(e) => setNewSla({...newSla, resolutionTime: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="escalation" className="text-sm font-medium">Email de Escalación</label>
                  <Input
                    id="escalation"
                    type="email"
                    placeholder="Correo para escalaciones"
                    value={newSla.escalation}
                    onChange={(e) => setNewSla({...newSla, escalation: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpenDialog(false);
                  setEditingSla(null);
                  setNewSla({
                    name: "",
                    category: "",
                    priority: "media",
                    responseTime: 4,
                    resolutionTime: 24,
                    escalation: "",
                  });
                }}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleAddSla}>
                  {editingSla ? "Guardar Cambios" : "Crear Regla SLA"}
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
              <TableHead className="hidden md:table-cell">Categoría</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead className="hidden md:table-cell">Tiempo de Respuesta</TableHead>
              <TableHead className="hidden md:table-cell">Tiempo de Resolución</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSlaRules.length > 0 ? (
              filteredSlaRules.map((sla) => (
                <TableRow key={sla.id}>
                  <TableCell className="font-medium">{sla.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{sla.category.replace(/_/g, ' ')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${sla.priority === 'baja' ? 'bg-gray-100 text-gray-800' : ''}
                      ${sla.priority === 'media' ? 'bg-blue-100 text-blue-800' : ''}
                      ${sla.priority === 'alta' ? 'bg-orange-100 text-orange-800' : ''}
                      ${sla.priority === 'crítica' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {sla.priority.charAt(0).toUpperCase() + sla.priority.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-slate-500" />
                      {sla.responseTime} {sla.responseTime === 1 ? 'hora' : 'horas'}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-slate-500" />
                      {sla.resolutionTime} {sla.resolutionTime === 1 ? 'hora' : 'horas'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditSla(sla)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteSla(sla.id)}
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
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No se encontraron reglas SLA
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SlaRulesConfig;
