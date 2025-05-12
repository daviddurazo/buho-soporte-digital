
// User related types
export type UserRole = 'student' | 'professor' | 'technician' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Ticket related types
export type TicketStatus = 'nuevo' | 'asignado' | 'en_progreso' | 'resuelto' | 'cerrado';
export type TicketPriority = 'baja' | 'media' | 'alta' | 'crítica';

export interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  created_at: string;
  updated_at: string;
  creator_id: string | null;
  assigned_to_id: string | null;
  due_date: string | null;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  ticket_id: string;
  user_id: string;
}

export interface Attachment {
  id: string;
  filename: string;
  path: string;
  mime_type: string;
  size: number;
  created_at: string;
  ticket_id: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  created_at: string;
  user_id: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface TicketHistory {
  id: string;
  action: string;
  created_at: string;
  ticket_id: string;
  user_id: string;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Category related types based on user roles
export const studentCategories = [
  'wifi_campus',
  'acceso_biblioteca',
  'problemas_lms',
  'correo_institucional',
  'portales_estudiantes',
  'otro_estudiante'
];

export const professorCategories = [
  'proyector_aula',
  'sitio_curso',
  'sistema_calificaciones',
  'software_academico',
  'correo_institucional',
  'acceso_biblioteca',
  'otro_profesor'
];

export const technicianCategories = [
  'hardware',
  'software',
  'redes',
  'servidores',
  'seguridad',
  'otro_tecnico'
];

export const adminCategories = [
  ...studentCategories,
  ...professorCategories,
  ...technicianCategories,
  'administracion_usuarios',
  'configuracion_sistema',
  'reportes',
  'otro_admin'
];

export const getCategoriesByRole = (role: UserRole): string[] => {
  switch(role) {
    case 'student':
      return studentCategories;
    case 'professor':
      return professorCategories;
    case 'technician':
      return technicianCategories;
    case 'admin':
      return adminCategories;
    default:
      return [];
  }
};

export const translateCategory = (category: string): string => {
  const categoryTranslations: Record<string, string> = {
    // Student categories
    'wifi_campus': 'WiFi del Campus',
    'acceso_biblioteca': 'Acceso a Biblioteca',
    'problemas_lms': 'Problemas con Plataforma LMS',
    'correo_institucional': 'Correo Institucional',
    'portales_estudiantes': 'Portales para Estudiantes',
    'otro_estudiante': 'Otro Problema (Estudiante)',
    
    // Professor categories
    'proyector_aula': 'Proyector de Aula',
    'sitio_curso': 'Sitio del Curso',
    'sistema_calificaciones': 'Sistema de Calificaciones',
    'software_academico': 'Software Académico',
    'otro_profesor': 'Otro Problema (Profesor)',
    
    // Technician categories
    'hardware': 'Problemas de Hardware',
    'software': 'Problemas de Software',
    'redes': 'Problemas de Red',
    'servidores': 'Servidores',
    'seguridad': 'Seguridad Informática',
    'otro_tecnico': 'Otro Problema (Técnico)',
    
    // Admin categories
    'administracion_usuarios': 'Administración de Usuarios',
    'configuracion_sistema': 'Configuración del Sistema',
    'reportes': 'Reportes',
    'otro_admin': 'Otro Problema (Administrador)'
  };
  
  return categoryTranslations[category] || category;
};

export const translateStatus = (status: TicketStatus): string => {
  const statusTranslations: Record<TicketStatus, string> = {
    'nuevo': 'Nuevo',
    'asignado': 'Asignado',
    'en_progreso': 'En Progreso',
    'resuelto': 'Resuelto',
    'cerrado': 'Cerrado'
  };
  
  return statusTranslations[status] || status;
};

export const translatePriority = (priority: TicketPriority): string => {
  const priorityTranslations: Record<TicketPriority, string> = {
    'baja': 'Baja',
    'media': 'Media',
    'alta': 'Alta',
    'crítica': 'Crítica'
  };
  
  return priorityTranslations[priority] || priority;
};
