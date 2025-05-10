
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, Plus, Pencil, Trash2 } from "lucide-react";
import { adminCategories, studentCategories, professorCategories, technicianCategories } from "@/types";

// Category type definition
type Category = {
  id: string;
  name: string;
  description: string;
  forRoles: string[];
  createdAt: string;
};

const CategoriesConfig = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    ...adminCategories.map((cat, index) => ({
      id: `cat-${index + 1}`,
      name: cat,
      description: `Categoría para problemas relacionados con ${cat.replace(/_/g, ' ')}`,
      forRoles: ["admin"],
      createdAt: "2023-01-15"
    })),
    ...studentCategories.map((cat, index) => ({
      id: `cat-s-${index + 1}`,
      name: cat,
      description: `Categoría para problemas relacionados con ${cat.replace(/_/g, ' ')}`,
      forRoles: ["student", "admin"],
      createdAt: "2023-01-15"
    })),
    ...professorCategories.map((cat, index) => ({
      id: `cat-p-${index + 1}`,
      name: cat,
      description: `Categoría para problemas relacionados con ${cat.replace(/_/g, ' ')}`,
      forRoles: ["professor", "admin"],
      createdAt: "2023-01-20"
    })),
    ...technicianCategories.map((cat, index) => ({
      id: `cat-t-${index + 1}`,
      name: cat,
      description: `Categoría para problemas relacionados con ${cat.replace(/_/g, ' ')}`,
      forRoles: ["technician", "admin"],
      createdAt: "2023-01-25"
    })),
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    forRoles: ["admin", "student", "professor", "technician"],
  });

  // Filter categories based on search term
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.description) {
      if (editingCategory) {
        // Update existing category
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? {
            ...cat,
            name: newCategory.name,
            description: newCategory.description,
            forRoles: newCategory.forRoles,
          } : cat
        ));
        toast({
          title: "Categoría actualizada",
          description: `La categoría ${newCategory.name} ha sido actualizada exitosamente.`,
        });
      } else {
        // Add new category
        const newId = `cat-${Date.now()}`;
        setCategories([...categories, {
          id: newId,
          name: newCategory.name,
          description: newCategory.description,
          forRoles: newCategory.forRoles,
          createdAt: new Date().toISOString().split('T')[0],
        }]);
        toast({
          title: "Categoría creada",
          description: `La categoría ${newCategory.name} ha sido creada exitosamente.`,
        });
      }
      
      setNewCategory({ name: "", description: "", forRoles: ["admin", "student", "professor", "technician"] });
      setEditingCategory(null);
      setOpenDialog(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre y la descripción son obligatorios.",
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      forRoles: [...category.forRoles],
    });
    setOpenDialog(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar esta categoría?")) {
      setCategories(categories.filter(cat => cat.id !== id));
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
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
      description: "Exportando categorías a CSV...",
    });
    
    // Simple CSV export logic
    const csvContent = [
      ["id", "name", "description", "forRoles", "createdAt"],
      ...categories.map(c => [
        c.id,
        c.name,
        c.description,
        c.forRoles.join("|"),
        c.createdAt
      ])
    ]
      .map(e => e.join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "categorias_soporte.csv");
    link.click();
  };

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
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                  <Input
                    id="name"
                    placeholder="Nombre de la categoría"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Descripción</label>
                  <Input
                    id="description"
                    placeholder="Descripción de la categoría"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Disponible para roles</label>
                  <div className="flex flex-wrap gap-2">
                    {["admin", "student", "professor", "technician"].map(role => (
                      <div key={role} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`role-${role}`}
                          checked={newCategory.forRoles.includes(role)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCategory({
                                ...newCategory,
                                forRoles: [...newCategory.forRoles, role]
                              });
                            } else {
                              setNewCategory({
                                ...newCategory,
                                forRoles: newCategory.forRoles.filter(r => r !== role)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={`role-${role}`} className="text-sm capitalize">
                          {role === "admin" ? "Administrador" : 
                           role === "student" ? "Estudiante" : 
                           role === "professor" ? "Profesor" : 
                           "Técnico"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpenDialog(false);
                  setEditingCategory(null);
                  setNewCategory({ name: "", description: "", forRoles: ["admin", "student", "professor", "technician"] });
                }}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleAddCategory}>
                  {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
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
              <TableHead className="hidden md:table-cell">Descripción</TableHead>
              <TableHead className="hidden md:table-cell">Roles</TableHead>
              <TableHead className="hidden md:table-cell">Fecha Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="hidden md:table-cell">{category.description}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {category.forRoles.map(role => (
                        <span 
                          key={role} 
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                        >
                          {role === "admin" ? "Administrador" : 
                           role === "student" ? "Estudiante" : 
                           role === "professor" ? "Profesor" : 
                           "Técnico"}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{category.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteCategory(category.id)}
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
                  No se encontraron categorías
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoriesConfig;
