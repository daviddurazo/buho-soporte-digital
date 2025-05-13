
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface TicketTableProps {
  selectedCategory: string | null;
}

export const TicketTable: React.FC<TicketTableProps> = ({ selectedCategory }) => {
  const fetchRecurringIssues = async () => {
    let query = supabase
      .from('tickets')
      .select('title, category, count(*)')
      .order('count', { ascending: false });
      
    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }
    
    const { data, error } = await query.limit(10);
    
    if (error) {
      console.error('Error fetching recurring issues:', error);
      throw error;
    }
    
    // Format the data to match our expected structure
    return data.map((item: any, index: number) => ({
      id: index + 1,
      issue: item.title,
      category: item.category,
      count: item.count
    }));
  };
  
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['recurringIssues', selectedCategory],
    queryFn: fetchRecurringIssues
  });
  
  const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'hardware': 'Hardware',
      'software': 'Software',
      'redes': 'Red',
      'servidores': 'Servidores',
      'wifi_campus': 'WiFi Campus',
      'acceso_biblioteca': 'Biblioteca',
      'problemas_lms': 'LMS',
      'correo_institucional': 'Correo',
      'sistema_calificaciones': 'Calificaciones',
      'software_academico': 'Software Académico'
    };
    
    return categoryMap[category] || category;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2">Cargando datos...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md">
        <p className="text-red-600">Error al cargar los datos</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Incidencia</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-right">Recurrencia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.issue}</TableCell>
                <TableCell>
                  <Badge variant="outline">{translateCategory(item.category)}</Badge>
                </TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                No se encontraron datos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
