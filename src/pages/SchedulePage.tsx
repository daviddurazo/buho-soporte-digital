
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const SchedulePage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unison-blue"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user || user.role !== 'professor') {
    return <Navigate to="/auth" />;
  }
  
  // Datos de ejemplo para el horario
  const scheduleData = [
    { day: 'Lunes', time: '08:00 - 10:00', course: 'Programación Avanzada', classroom: 'B-12' },
    { day: 'Lunes', time: '10:00 - 12:00', course: 'Bases de Datos', classroom: 'Lab-3' },
    { day: 'Martes', time: '09:00 - 11:00', course: 'Sistemas Operativos', classroom: 'C-5' },
    { day: 'Miércoles', time: '08:00 - 10:00', course: 'Programación Avanzada', classroom: 'B-12' },
    { day: 'Jueves', time: '10:00 - 12:00', course: 'Bases de Datos', classroom: 'Lab-3' },
    { day: 'Viernes', time: '11:00 - 13:00', course: 'Tutoría Académica', classroom: 'Oficina-210' },
  ];
  
  const currentDay = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date || new Date());
  const todaySchedule = scheduleData.filter(item => 
    item.day.toLowerCase() === currentDay.toLowerCase()
  );
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Mi Horario</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendario</CardTitle>
              <CardDescription>Seleccione una fecha para ver su horario</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                Horario para {date?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </CardTitle>
              <CardDescription>
                {todaySchedule.length > 0 
                  ? `${todaySchedule.length} clase(s) programada(s)` 
                  : 'No hay clases programadas para este día'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="day" className="w-full">
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="day">Por día</TabsTrigger>
                  <TabsTrigger value="week">Semanal</TabsTrigger>
                </TabsList>
                
                <TabsContent value="day">
                  <ScrollArea className="h-72">
                    {todaySchedule.length > 0 ? (
                      <div className="space-y-3">
                        {todaySchedule.map((item, i) => (
                          <div key={i} className="p-3 border rounded-md">
                            <div className="font-medium">{item.course}</div>
                            <div className="text-sm text-muted-foreground">{item.time}</div>
                            <div className="text-sm text-muted-foreground">Aula: {item.classroom}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        No hay clases programadas para este día
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="week">
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(day => {
                        const daySchedule = scheduleData.filter(item => item.day === day);
                        return (
                          <div key={day} className="space-y-2">
                            <h3 className="font-semibold">{day}</h3>
                            {daySchedule.length > 0 ? (
                              daySchedule.map((item, i) => (
                                <div key={i} className="p-2 border-l-2 border-unison-blue pl-3">
                                  <div className="font-medium">{item.course}</div>
                                  <div className="text-xs text-muted-foreground">{item.time} - {item.classroom}</div>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">Sin clases</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default SchedulePage;
