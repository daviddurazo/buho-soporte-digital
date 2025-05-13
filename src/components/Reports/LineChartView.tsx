
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LineChartViewProps {
  selectedCategory: string | null;
}

export const LineChartView: React.FC<LineChartViewProps> = ({ selectedCategory }) => {
  // This would ideally fetch time series data from the database
  // For now, we'll generate mock data that simulates a database query response
  const fetchResolutionTimeData = async () => {
    // In a real implementation, this would query ticket resolution times by day
    // Here we'll generate some mock time-series data
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    // Base data
    let mockData = days.map(day => ({
      day,
      'all': Math.floor(Math.random() * 8) + 1, // 1-8 hours
      'hardware': Math.floor(Math.random() * 6) + 2, // 2-7 hours
      'software': Math.floor(Math.random() * 5) + 1, // 1-5 hours
      'redes': Math.floor(Math.random() * 9) + 3, // 3-11 hours
      'wifi_campus': Math.floor(Math.random() * 4) + 1, // 1-4 hours
      'acceso_biblioteca': Math.floor(Math.random() * 3) + 1, // 1-3 hours
      'problemas_lms': Math.floor(Math.random() * 7) + 2, // 2-8 hours
      'correo_institucional': Math.floor(Math.random() * 6) + 1, // 1-6 hours
      'sistema_calificaciones': Math.floor(Math.random() * 5) + 2, // 2-6 hours
      'software_academico': Math.floor(Math.random() * 8) + 3, // 3-10 hours
    }));
    
    // If we had real data, we would query the database like this:
    /*
    let query = supabase.rpc('get_resolution_time_by_day');
    
    if (selectedCategory && selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching resolution time data:', error);
      throw error;
    }
    
    return data;
    */
    
    // For now, return our mock data
    return mockData;
  };
  
  const { data = [] } = useQuery({
    queryKey: ['resolutionTimeData', selectedCategory],
    queryFn: fetchResolutionTimeData
  });
  
  // Determine which line to show based on selected category
  const categoryKey = selectedCategory && selectedCategory !== 'all' ? selectedCategory : 'all';
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => [`${value} horas`, 'Tiempo promedio']} />
        <Line 
          type="monotone" 
          dataKey={categoryKey} 
          stroke="#3b82f6" 
          activeDot={{ r: 8 }} 
          name="Tiempo de resolución" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
