
import React, { useState } from "react";
import { 
  Table, TableHeader, TableBody, TableRow, 
  TableHead, TableCell, TableCaption 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { UserRole } from "@/types";
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react";
import UserForm from "./UserForm";
import UserDetails from "./UserDetails";
import PermissionsMatrix from "./PermissionsMatrix";

// Mock data - would come from API in a real app
const mockUsers = [
  {
    id: "U-001",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@unison.mx",
    role: "student" as UserRole,
    active: true,
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "U-002",
    firstName: "María",
    lastName: "García",
    email: "maria.garcia@unison.mx",
    role: "professor" as UserRole,
    active: true,
    createdAt: "2022-09-05T14:20:00Z",
  },
  {
    id: "U-003",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@unison.mx",
    role: "technician" as UserRole,
    active: true,
    createdAt: "2022-11-20T09:15:00Z",
  },
  {
    id: "U-004",
    firstName: "Laura",
    lastName: "Martínez",
    email: "laura.martinez@unison.mx",
    role: "admin" as UserRole,
    active: true,
    createdAt: "2022-08-12T11:45:00Z",
  },
  {
    id: "U-005",
    firstName: "Roberto",
    lastName: "Fernández",
    email: "roberto.fernandez@unison.mx",
    role: "professor" as UserRole,
    active: false,
    createdAt: "2023-02-28T16:10:00Z",
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const itemsPerPage = 5;

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && user.active) || 
      (statusFilter === "inactive" && !user.active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginate filtered users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleCreateUser = (userData: any) => {
    // In a real app, this would be an API call
    const newUser = {
      id: `U-${(users.length + 1).toString().padStart(3, '0')}`,
      ...userData,
      active: true,
      createdAt: new Date().toISOString(),
    };
    
    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    toast.success("Usuario creado exitosamente");
  };

  const handleEditUser = (userData: any) => {
    // In a real app, this would be an API call
    const updatedUsers = users.map((user) => 
      user.id === selectedUser.id ? { ...user, ...userData } : user
    );
    
    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    toast.success("Usuario actualizado exitosamente");
  };

  const handleDeleteUser = () => {
    // In a real app, this would be an API call
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    
    setUsers(updatedUsers);
    setIsDeleteDialogOpen(false);
    toast.success("Usuario eliminado exitosamente");
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openDetailsDialog = (user: any) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const translateRole = (role: UserRole) => {
    const roleTranslations: Record<UserRole, string> = {
      student: 'Estudiante',
      professor: 'Profesor',
      technician: 'Técnico',
      admin: 'Administrador',
    };
    
    return roleTranslations[role] || role;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gestionar Usuarios</h2>
        <Button 
          className="bg-unison-blue hover:bg-blue-700"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="student">Estudiantes</SelectItem>
                  <SelectItem value="professor">Profesores</SelectItem>
                  <SelectItem value="technician">Técnicos</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Tabs defaultValue="users">
          <TabsList className="p-2 bg-muted/20">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="permissions">Matriz de Permisos</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No se encontraron usuarios con los filtros actuales
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{translateRole(user.role)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.active ? "default" : "outline"}
                            className={user.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                          >
                            {user.active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetailsDialog(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
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
              <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="permissions">
            <div className="p-4">
              <PermissionsMatrix />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Ingrese los datos del nuevo usuario. Todos los campos son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <UserForm onSubmit={handleCreateUser} />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualice la información del usuario.
            </DialogDescription>
          </DialogHeader>
          <UserForm user={selectedUser} onSubmit={handleEditUser} />
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar a {selectedUser?.firstName} {selectedUser?.lastName}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
            <DialogDescription>
              Información detallada y actividad del usuario.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && <UserDetails user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
