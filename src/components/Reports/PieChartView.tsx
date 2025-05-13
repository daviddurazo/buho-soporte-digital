
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const PieChartView: React.FC = () => {
  // In a real implementation, this would query satisfaction ratings
  // For now, we'll generate mock data that simulates database results
  const fetchSatisfactionData = async () => {
    // In a real implementation, we would query satisfaction ratings from feedback table
    // Here we're generating mock data
    
    // This would be a query like:
    /*
    const { data, error } = await supabase
      .from('ticket_feedback')
      .select('rating, count(*)')
      .group('rating');
      
    if (error) {
      console.error('Error fetching satisfaction data:', error);
      throw error;
    }
    
    // Format data for the pie chart
    return data.map(item => ({
      name: getSatisfactionLabel(item.rating),
      value: item.count
    }));
    */
    
    // Mock data until we have a feedback table
    return [
      { name: 'Muy Satisfecho', value: 42 },
      { name: 'Satisfecho', value: 28 },
      { name: 'Neutral', value: 15 },
      { name: 'Insatisfecho', value: 10 },
      { name: 'Muy Insatisfecho', value: 5 },
    ];
  };
  
  const { data = [] } = useQuery({
    queryKey: ['satisfactionData'],
    queryFn: fetchSatisfactionData
  });
  
  // Colors for the pie chart segments
  const COLORS = ['#22c55e', '#84cc16', '#facc15', '#f97316', '#ef4444'];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} usuarios`, 'Cantidad']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
