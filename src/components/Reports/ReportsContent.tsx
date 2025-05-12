import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/Reports/DateRangePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChartView } from '@/components/Reports/BarChartView';
import { LineChartView } from '@/components/Reports/LineChartView';
import { PieChartView } from '@/components/Reports/PieChartView';
import { TicketTable } from '@/components/Reports/TicketTable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CalendarRange, BarChart, LineChart, PieChart, Download, FileText, FileCsv } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';

export const ReportsContent: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock summary data
  const summaryData = {
    totalTickets: 278,
    avgResponseTime: '2.4h',
    slaRate: '89%',
  };

  // Mock data para exportación
  const mockExportData = [
    { id: 1, titulo: 'Problema con impresora', categoria: 'Hardware', prioridad: 'Alta', estado: 'Abierto', creacion: '2023-05-10' },
    { id: 2, titulo: 'Error en aplicación', categoria: 'Software', prioridad: 'Media', estado: 'En progreso', creacion: '2023-05-12' },
    { id: 3, titulo: 'Acceso denegado', categoria: 'Red', prioridad: 'Baja', estado: 'Cerrado', creacion: '2023-05-15' },
    // ... más datos
  ];

  const exportColumns = ['ID', 'Título', 'Categoría', 'Prioridad', 'Estado', 'Fecha de creación'];

  // Función para exportar a CSV
  const handleExportCSV = () => {
    setIsLoading(true);
    setTimeout(() => {
      exportToCSV(mockExportData, 'tickets-reporte');
      setIsLoading(false);
    }, 500);
  };

  // Función para exportar a PDF
  const handleExportPDF = () => {
    setIsLoading(true);
    setTimeout(() => {
      exportToPDF(mockExportData, 'tickets-reporte', exportColumns);
      setIsLoading(false);
    }, 500);
  };

  // Mock categories
  const categories = [
    { id: 'hardware', name: 'Hardware' },
    { id: 'software', name: 'Software' },
    { id: 'network', name: 'Red' },
    { id: 'access', name: 'Acceso' },
    { id: 'other', name: 'Otros' },
  ];

  // Handle chart category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    toast.info(`Filtrado por categoría: ${category}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} disabled={isLoading} variant="outline">
            <FileCsv className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={handleExportPDF} disabled={isLoading} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Ajusta los filtros para personalizar los reportes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rango de Fechas</label>
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rol de Usuario</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="student">Estudiante</SelectItem>
                  <SelectItem value="professor">Profesor</SelectItem>
                  <SelectItem value="technician">Técnico</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{summaryData.totalTickets}</div>
              <Badge variant="outline" className="bg-soft-blue">
                {dateRange?.from && dateRange?.to 
                  ? `${new Date(dateRange.from).toLocaleDateString()} - ${new Date(dateRange.to).toLocaleDateString()}`
                  : 'Último mes'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tiempo promedio de respuesta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{summaryData.avgResponseTime}</div>
              <Badge variant="outline" className="bg-soft-purple">-12% vs periodo anterior</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cumplimiento de SLA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{summaryData.slaRate}</div>
              <Badge variant="outline" className="bg-soft-green">+3% vs periodo anterior</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Tickets por Categoría
            </CardTitle>
            <CardDescription>Distribución de tickets por tipo de incidencia</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChartView onCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} />
          </CardContent>
        </Card>
        
        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Tiempo de Resolución
            </CardTitle>
            <CardDescription>Tiempo promedio de resolución diario</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChartView selectedCategory={selectedCategory} />
          </CardContent>
        </Card>
        
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Satisfacción del Usuario
            </CardTitle>
            <CardDescription>Basado en encuestas post-resolución</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChartView />
          </CardContent>
        </Card>
        
        {/* Table with Top Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Incidencias Recurrentes</CardTitle>
            <CardDescription>Las incidencias más reportadas en el período</CardDescription>
          </CardHeader>
          <CardContent>
            <TicketTable selectedCategory={selectedCategory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
