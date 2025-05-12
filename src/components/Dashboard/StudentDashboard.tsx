
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, Book, HelpCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const dummyTickets = [
  {
    id: '1',
    title: 'Problema con acceso a WiFi',
    status: 'nuevo',
    createdAt: '2023-06-01T10:30:00Z',
  },
  {
    id: '2',
    title: 'No puedo acceder a la biblioteca virtual',
    status: 'en_progreso',
    createdAt: '2023-05-25T14:20:00Z',
  },
];

export const StudentDashboard: React.FC = () => {
  const [tickets] = useState(dummyTickets);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Estudiante</h2>
        <Button className="bg-unison-yellow text-black hover:bg-amber-600" asChild>
          <Link to="/tickets/new">
            <FileText className="mr-2 h-4 w-4" /> Reportar Nueva Incidencia
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Acceso Rápido</CardTitle>
            <CardDescription>Reporta problemas comunes</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/tickets/new">
                <Wifi className="mr-2 h-4 w-4" /> Problemas de WiFi
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/tickets/new">
                <Book className="mr-2 h-4 w-4" /> Acceso Biblioteca
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/tickets/new">
                <HelpCircle className="mr-2 h-4 w-4" /> Plataforma LMS
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mis Incidencias Recientes</CardTitle>
            <CardDescription>Últimas incidencias reportadas</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length > 0 ? (
              <div className="space-y-2">
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
                          ${ticket.status === 'en_progreso' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${ticket.status === 'resuelto' ? 'bg-green-100 text-green-800' : ''}
                        `}>
                          {ticket.status === 'nuevo' ? 'Nuevo' : 
                            ticket.status === 'en_progreso' ? 'En Progreso' : 'Resuelto'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No has reportado ninguna incidencia</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Anuncios</CardTitle>
            <CardDescription>Información importante del departamento de TI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                <p className="font-medium">Mantenimiento Programado</p>
                <p className="text-sm">El servidor de archivos estará en mantenimiento este sábado de 2am a 5am.</p>
              </div>
              <div className="p-3 border-l-4 border-green-500 bg-green-50 rounded">
                <p className="font-medium">Nueva Versión del Portal</p>
                <p className="text-sm">Hemos actualizado el portal estudiantil. Explora las nuevas características.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Estado de Servicios</CardTitle>
            <CardDescription>Estado actual de los servicios universitarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>WiFi Campus</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operativo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Biblioteca Virtual</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operativo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Plataforma LMS</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Lento
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Portal Estudiantes</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operativo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Correo Institucional</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operativo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
