
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { UserRole } from "@/types";

// Define the permissions structure
interface Permission {
  id: string;
  description: string;
  permissions: {
    [key in UserRole]: {
      read: boolean;
      write: boolean;
      delete: boolean;
    };
  };
}

const PermissionsMatrix = () => {
  // Initial permissions state
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "tickets",
      description: "Tickets de Soporte",
      permissions: {
        student: { read: true, write: true, delete: false },
        professor: { read: true, write: true, delete: false },
        technician: { read: true, write: true, delete: true },
        admin: { read: true, write: true, delete: true },
      },
    },
    {
      id: "users",
      description: "Gestión de Usuarios",
      permissions: {
        student: { read: false, write: false, delete: false },
        professor: { read: false, write: false, delete: false },
        technician: { read: true, write: false, delete: false },
        admin: { read: true, write: true, delete: true },
      },
    },
    {
      id: "reports",
      description: "Reportes y Estadísticas",
      permissions: {
        student: { read: false, write: false, delete: false },
        professor: { read: true, write: false, delete: false },
        technician: { read: true, write: true, delete: false },
        admin: { read: true, write: true, delete: true },
      },
    },
    {
      id: "settings",
      description: "Configuración del Sistema",
      permissions: {
        student: { read: false, write: false, delete: false },
        professor: { read: false, write: false, delete: false },
        technician: { read: true, write: false, delete: false },
        admin: { read: true, write: true, delete: true },
      },
    },
    {
      id: "audit",
      description: "Logs de Auditoría",
      permissions: {
        student: { read: false, write: false, delete: false },
        professor: { read: false, write: false, delete: false },
        technician: { read: true, write: false, delete: false },
        admin: { read: true, write: false, delete: false },
      },
    },
  ]);

  // Toggle permission handler
  const togglePermission = (
    resourceId: string,
    role: UserRole,
    permissionType: "read" | "write" | "delete"
  ) => {
    setPermissions(
      permissions.map((resource) =>
        resource.id === resourceId
          ? {
              ...resource,
              permissions: {
                ...resource.permissions,
                [role]: {
                  ...resource.permissions[role],
                  [permissionType]: !resource.permissions[role][permissionType],
                },
              },
            }
          : resource
      )
    );
  };

  const handleSavePermissions = () => {
    // In a real app, this would be an API call to save permissions
    toast.success("Permisos actualizados correctamente", {
      description: "Los cambios han sido guardados en el sistema.",
    });
  };

  const translateRole = (role: UserRole) => {
    const roleTranslations: Record<UserRole, string> = {
      student: "Estudiante",
      professor: "Profesor",
      technician: "Técnico",
      admin: "Administrador",
    };
    
    return roleTranslations[role] || role;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Matriz de Permisos por Rol</h3>
        <Button onClick={handleSavePermissions}>Guardar Cambios</Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Recurso</TableHead>
              <TableHead className="text-center" colSpan={3}>Estudiante</TableHead>
              <TableHead className="text-center" colSpan={3}>Profesor</TableHead>
              <TableHead className="text-center" colSpan={3}>Técnico</TableHead>
              <TableHead className="text-center" colSpan={3}>Administrador</TableHead>
            </TableRow>
            <TableRow>
              <TableHead></TableHead>
              {/* Repeat for each role */}
              {["student", "professor", "technician", "admin"].map((role) => (
                <React.Fragment key={role}>
                  <TableHead className="text-center">Leer</TableHead>
                  <TableHead className="text-center">Escribir</TableHead>
                  <TableHead className="text-center">Eliminar</TableHead>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.description}</TableCell>
                {/* For each role, render 3 permission cells: read, write, delete */}
                {Object.entries(resource.permissions).map(([role, perms]) => (
                  <React.Fragment key={role}>
                    {/* Read permission */}
                    <TableCell className="text-center">
                      <Checkbox
                        checked={perms.read}
                        onCheckedChange={() =>
                          togglePermission(
                            resource.id,
                            role as UserRole,
                            "read"
                          )
                        }
                      />
                    </TableCell>
                    {/* Write permission */}
                    <TableCell className="text-center">
                      <Checkbox
                        checked={perms.write}
                        disabled={!perms.read}
                        onCheckedChange={() =>
                          togglePermission(
                            resource.id,
                            role as UserRole,
                            "write"
                          )
                        }
                      />
                    </TableCell>
                    {/* Delete permission */}
                    <TableCell className="text-center">
                      <Checkbox
                        checked={perms.delete}
                        disabled={!perms.write}
                        onCheckedChange={() =>
                          togglePermission(
                            resource.id,
                            role as UserRole,
                            "delete"
                          )
                        }
                      />
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4">
        <p>Nota: Las modificaciones de permisos se aplican a todos los usuarios con el rol correspondiente.</p>
        <Button size="sm" variant="outline" onClick={() => window.location.href = "/audit-logs"}>
          Ver Logs de Auditoría
        </Button>
      </div>
    </div>
  );
};

export default PermissionsMatrix;
