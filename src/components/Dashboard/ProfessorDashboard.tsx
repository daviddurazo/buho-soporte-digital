
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Projector, BookOpen, FileBarChart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const dummyTickets = [
  {
    id: '1',
    title: 'Proyector no funciona en Aula B-12',
    status: 'asignado',
    createdAt: '2023-06-02T09:45:00Z',
  },
  {
    id: '2',
    title: 'Problema con subida de calificaciones',
    status: 'en_progreso',
    createdAt: '2023-05-28T11:20:00Z',
  },
  {
    id: '3',
    title: 'Acceso al repositorio de materiales',
    status: 'resuelto',
    createdAt: '2023-05-20T16:30:00Z',
  },
];

export const ProfessorDashboard: React.FC = () => {
  const [tickets] = useState(dummyTickets);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Profesor</h2>
        <Button className="bg-unison-yellow text-black hover:bg-amber-600" asChild>
          <Link to="/tickets/new">
            <FileText className="mr-2 h-4 w-4" /> Reportar Nueva Incidencia
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Herramientas de Enseñanza</CardTitle>
            <CardDescription>Reporta problemas con herramientas</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/tickets/new">
                <Projector className="mr-2 h-4 w-4" /> Proyector de Aula
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/tickets/new">
                <BookOpen className="mr-2 h-4 w-4" /> Sitio del Curso
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/tickets/new">
                <FileBarChart className="mr-2 h-4 w-4" /> Sistema de Calificaciones
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Incidencias Docentes</CardTitle>
            <CardDescription>Incidencias recientes y su estado</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map(ticket => (
                  <Link to="/tickets" key={ticket.id} className="block">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                      <div>
                        <p className="font-medium">{ticket.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                      <div>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${ticket.status === 'nuevo' ? 'bg-blue-100 text-blue-800' : ''}
                          ${ticket.status === 'asignado' ? 'bg-purple-100 text-purple-800' : ''}
                          ${ticket.status === 'en_progreso' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${ticket.status === 'resuelto' ? 'bg-green-100 text-green-800' : ''}
                        `}>
                          {ticket.status === 'nuevo' ? 'Nuevo' : 
                            ticket.status === 'asignado' ? 'Asignado' :
                              ticket.status === 'en_progreso' ? 'En Progreso' : 'Resuelto'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No hay incidencias reportadas</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mantenimiento Planificado</CardTitle>
            <CardDescription>Calendario de mantenimiento de sistemas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Actualización Sistema de Calificaciones</p>
                    <p className="text-sm text-muted-foreground">Junio 15, 2023 · 22:00 - 02:00</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Próximo
                  </span>
                </div>
                <p className="mt-2 text-sm">El sistema no estará disponible durante este período.</p>
              </div>
              
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Mantenimiento Plataforma LMS</p>
                    <p className="text-sm text-muted-foreground">Junio 20, 2023 · 01:00 - 05:00</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Próximo
                  </span>
                </div>
                <p className="mt-2 text-sm">Se recomienda guardar trabajo pendiente antes de esta fecha.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recursos para Docentes</CardTitle>
            <CardDescription>Guías y tutoriales disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded transition">
                <p className="font-medium">Guía de Uso del Proyector</p>
                <p className="text-sm text-muted-foreground">PDF · 2MB</p>
              </a>
              <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded transition">
                <p className="font-medium">Tutorial de Calificaciones</p>
                <p className="text-sm text-muted-foreground">Video · 10min</p>
              </a>
              <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded transition">
                <p className="font-medium">Manual de Plataforma LMS</p>
                <p className="text-sm text-muted-foreground">PDF · 5MB</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
