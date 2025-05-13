
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, FileText, Users, Settings, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ChartDataItem {
  name: string;
  value: number;
}

// Define types for RPC function responses
interface StatusCount {
  status: string;
  count: string; // It's returned as string from Postgres
}

interface CategoryCount {
  category: string;
  count: string; // It's returned as string from Postgres
}

interface RoleCount {
  role: string;
  count: string; // It's returned as string from Postgres
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch ticket counts by status using stored procedure
  const fetchTicketsByStatus = async (): Promise<ChartDataItem[]> => {
    try {
      const { data, error } = await supabase.rpc('get_tickets_by_status');
        
      if (error) {
        console.error('Error fetching tickets by status:', error);
        throw error;
      }
      
      // If the RPC is not set up yet or returns no data, use mock data
      if (!data || data.length === 0) {
        return [
          { name: 'Nuevos', value: 25 },
          { name: 'Asignados', value: 18 },
          { name: 'En Progreso', value: 15 },
          { name: 'Resueltos', value: 42 },
          { name: 'Cerrados', value: 12 }
        ];
      }
      
      // Format the data for the chart
      const statusMapping: Record<string, string> = {
        'nuevo': 'Nuevos',
        'asignado': 'Asignados',
        'en_progreso': 'En Progreso',
        'resuelto': 'Resueltos',
        'cerrado': 'Cerrados'
      };
      
      return (data as StatusCount[]).map((item) => ({
        name: statusMapping[item.status] || item.status,
        value: Number(item.count)
      }));
    } catch (error) {
      console.error('Error in fetchTicketsByStatus:', error);
      return [
        { name: 'Nuevos', value: 25 },
        { name: 'Asignados', value: 18 },
        { name: 'En Progreso', value: 15 },
        { name: 'Resueltos', value: 42 },
        { name: 'Cerrados', value: 12 }
      ];
    }
  };

  // Fetch ticket counts by category using stored procedure
  const fetchTicketsByCategory = async (): Promise<ChartDataItem[]> => {
    try {
      const { data, error } = await supabase.rpc('get_tickets_by_category');
        
      if (error) {
        console.error('Error fetching tickets by category:', error);
        throw error;
      }
      
      // If the RPC is not set up yet or returns no data, use mock data
      if (!data || data.length === 0) {
        return [
          { name: 'Hardware', value: 42 },
          { name: 'Software', value: 28 },
          { name: 'Redes', value: 15 },
          { name: 'WiFi Campus', value: 22 },
          { name: 'Biblioteca', value: 18 },
          { name: 'Calificaciones', value: 14 },
          { name: 'Correo', value: 8 },
          { name: 'Servidores', value: 10 }
        ];
      }
      
      // Format the data for the chart
      const categoryMapping: Record<string, string> = {
        'hardware': 'Hardware',
        'software': 'Software',
        'redes': 'Redes',
        'wifi_campus': 'WiFi Campus',
        'acceso_biblioteca': 'Biblioteca',
        'sistema_calificaciones': 'Calificaciones',
        'correo_institucional': 'Correo',
        'servidores': 'Servidores'
      };
      
      return (data as CategoryCount[]).map((item) => ({
        name: categoryMapping[item.category] || item.category,
        value: Number(item.count)
      }));
    } catch (error) {
      console.error('Error in fetchTicketsByCategory:', error);
      return [
        { name: 'Hardware', value: 42 },
        { name: 'Software', value: 28 },
        { name: 'Redes', value: 15 },
        { name: 'WiFi Campus', value: 22 },
        { name: 'Biblioteca', value: 18 },
        { name: 'Calificaciones', value: 14 },
        { name: 'Correo', value: 8 },
        { name: 'Servidores', value: 10 }
      ];
    }
  };

  // Fetch user counts by role
  const fetchUsersByRole = async (): Promise<ChartDataItem[]> => {
    try {
      const { data, error } = await supabase.rpc('get_users_by_role');
        
      if (error) {
        console.error('Error fetching users by role:', error);
        throw error;
      }
      
      // If the RPC is not set up yet or returns no data, use mock data
      if (!data || data.length === 0) {
        return [
          { name: 'Estudiantes', value: 450 },
          { name: 'Profesores', value: 120 },
          { name: 'Técnicos', value: 25 },
          { name: 'Administradores', value: 5 }
        ];
      }
      
      // Format the data for the chart
      const roleMapping: Record<string, string> = {
        'student': 'Estudiantes',
        'professor': 'Profesores',
        'technician': 'Técnicos',
        'admin': 'Administradores'
      };
      
      return (data as RoleCount[]).map((item) => ({
        name: roleMapping[item.role] || item.role,
        value: Number(item.count)
      }));
    } catch (error) {
      console.error('Error in fetchUsersByRole:', error);
      return [
        { name: 'Estudiantes', value: 450 },
        { name: 'Profesores', value: 120 },
        { name: 'Técnicos', value: 25 },
        { name: 'Administradores', value: 5 }
      ];
    }
  };
  
  // Mock daily ticket trend data (this would come from a real time-series query)
  const generateDailyTicketData = () => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map(day => ({
      name: day,
      nuevos: Math.floor(Math.random() * 10) + 1,
      resueltos: Math.floor(Math.random() * 8) + 1,
    }));
  };

  // Mock response time data (this would come from a real calculation)
  const generateResponseTimeData = () => {
    return [
      { name: '<1h', value: 27 },
      { name: '<4h', value: 42 },
      { name: '<12h', value: 18 },
      { name: '<24h', value: 8 },
      { name: '>24h', value: 5 },
    ];
  };

  // Fetch data using React Query
  const { data: ticketsByStatus = [] } = useQuery({
    queryKey: ['ticketsByStatus'],
    queryFn: fetchTicketsByStatus,
  });

  const { data: ticketsByCategory = [] } = useQuery({
    queryKey: ['ticketsByCategory'],
    queryFn: fetchTicketsByCategory,
  });

  const { data: usersByRole = [] } = useQuery({
    queryKey: ['usersByRole'],
    queryFn: fetchUsersByRole,
  });

  // For now, we'll use mock data for time series and response time
  const dailyTicketData = generateDailyTicketData();
  const responseTimeData = generateResponseTimeData();

  // Calculate total tickets
  const totalTickets = ticketsByStatus.reduce((sum, item) => sum + item.value, 0);
  
  // Pie chart colors
  const STATUS_COLORS = ['#3b82f6', '#6366f1', '#f59e0b', '#22c55e', '#6b7280'];
  const CATEGORY_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Administración</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/reports')}>
            <BarChart className="mr-2 h-4 w-4" /> Ver Reportes Completos
          </Button>
          <Button className="bg-unison-blue hover:bg-blue-700" onClick={() => navigate('/users')}>
            <Users className="mr-2 h-4 w-4" /> Gestionar Usuarios
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tickets Totales</CardDescription>
            <CardTitle className="text-3xl">{totalTickets}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div>Este mes</div>
              <div className="text-green-600">+4.6%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Usuarios Registrados</CardDescription>
            <CardTitle className="text-3xl">
              {usersByRole.reduce((sum, item) => sum + item.value, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div>Activos</div>
              <div>92%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tiempo de Resolución</CardDescription>
            <CardTitle className="text-3xl">1.6 días</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div>Promedio</div>
              <div className="text-green-600">-0.3 días</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cumplimiento SLA</CardDescription>
            <CardTitle className="text-3xl">94%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <Progress className="h-2 flex-1" value={94} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tickets by Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Estado de Tickets</CardTitle>
            <CardDescription>Distribución por estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {ticketsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Cantidad']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Daily Ticket Trend */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Tendencia de Tickets</CardTitle>
            <CardDescription>Nuevos vs. resueltos por día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTicketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="nuevos" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Nuevos" />
                  <Area type="monotone" dataKey="resueltos" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} name="Resueltos" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tickets by Category */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
            <CardDescription>Distribución por tipo de incidencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={ticketsByCategory}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Cantidad']} />
                  <Bar dataKey="value" fill="#6366f1" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tiempo de Respuesta</CardTitle>
            <CardDescription>Distribución de tiempos de primera respuesta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={responseTimeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {responseTimeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          index === 0 ? '#22c55e' : 
                          index === 1 ? '#84cc16' : 
                          index === 2 ? '#eab308' : 
                          index === 3 ? '#f59e0b' : 
                          '#ef4444'
                        } 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Usuarios por Rol</CardTitle>
            <CardDescription>Distribución de usuarios registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={usersByRole}
                  margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} usuarios`, 'Cantidad']} />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas de administración comunes</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button onClick={() => navigate('/users')} variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Gestionar Usuarios
            </Button>
            <Button onClick={() => navigate('/reports')} variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Generar Reportes
            </Button>
            <Button onClick={() => navigate('/config')} variant="outline" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configuración del Sistema
            </Button>
          </CardContent>
        </Card>
        
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Monitoreo de servicios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>API de Tickets</span>
              </div>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Autenticación</span>
              </div>
              <span className="text-xs text-muted-foreground">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Almacenamiento</span>
              </div>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span>Notificaciones</span>
              </div>
              <span className="text-xs text-muted-foreground">98.2%</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Mantenimiento Programado</CardTitle>
            <CardDescription>Próximos eventos de mantenimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Actualización de BD</div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="text-xs">15 Jun</span>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs text-muted-foreground">22:00 - 02:00</span>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Backup del Sistema</div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="text-xs">20 Jun</span>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs text-muted-foreground">01:00 - 03:00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
