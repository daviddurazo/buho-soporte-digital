
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BarChartViewProps {
  onCategoryClick: (category: string) => void;
  selectedCategory: string | null;
}

export const BarChartView: React.FC<BarChartViewProps> = ({ onCategoryClick, selectedCategory }) => {
  const fetchCategoryData = async () => {
    // Updated query to use correct Supabase syntax for grouping
    const { data, error } = await supabase.rpc('get_tickets_by_category');
      
    if (error) {
      console.error('Error fetching category data:', error);
      throw error;
    }
    
    // If data is not available yet or the RPC doesn't exist, use mock data
    if (!data) {
      const mockData = [
        { category: 'hardware', count: 42 },
        { category: 'software', count: 28 },
        { category: 'redes', count: 15 },
        { category: 'servidores', count: 10 },
        { category: 'wifi_campus', count: 22 },
        { category: 'acceso_biblioteca', count: 18 },
        { category: 'problemas_lms', count: 12 },
        { category: 'correo_institucional', count: 8 },
        { category: 'sistema_calificaciones', count: 14 },
        { category: 'software_academico', count: 9 },
      ];
      return mockData;
    }
    
    const categoryMapping: Record<string, string> = {
      'hardware': 'Hardware',
      'software': 'Software',
      'redes': 'Redes',
      'servidores': 'Servidores',
      'wifi_campus': 'WiFi Campus',
      'acceso_biblioteca': 'Biblioteca',
      'problemas_lms': 'LMS',
      'correo_institucional': 'Correo',
      'sistema_calificaciones': 'Calificaciones',
      'software_academico': 'Software Académico',
    };
    
    return data.map(item => ({
      category: item.category,
      displayName: categoryMapping[item.category] || item.category,
      count: item.count,
      fill: selectedCategory === item.category ? '#1e40af' : '#3b82f6'
    }));
  };
  
  const { data = [] } = useQuery({
    queryKey: ['categoryData', selectedCategory],
    queryFn: fetchCategoryData
  });
  
  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      onCategoryClick(data.activePayload[0].payload.category);
    }
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        onClick={handleBarClick}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="displayName" />
        <YAxis />
        <Tooltip 
          cursor={{ fill: '#f3f4f6' }}
          formatter={(value) => [`${value} tickets`, 'Cantidad']}
        />
        <Bar dataKey="count" name="Tickets" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
