
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LineChartViewProps {
  selectedCategory: string | null;
}

export const LineChartView: React.FC<LineChartViewProps> = ({ selectedCategory }) => {
  // Mock data for time series
  const data = [
    { day: 'Lun', hardware: 4.2, software: 3.5, red: 6.8, acceso: 2.5, otros: 3.0 },
    { day: 'Mar', hardware: 3.8, software: 4.0, red: 5.5, acceso: 2.8, otros: 3.2 },
    { day: 'Mié', hardware: 5.0, software: 3.2, red: 4.8, acceso: 3.0, otros: 2.8 },
    { day: 'Jue', hardware: 4.5, software: 3.8, red: 5.2, acceso: 2.6, otros: 2.5 },
    { day: 'Vie', hardware: 3.6, software: 4.2, red: 4.0, acceso: 2.4, otros: 2.9 },
    { day: 'Sáb', hardware: 2.8, software: 3.0, red: 3.5, acceso: 2.0, otros: 2.2 },
    { day: 'Dom', hardware: 2.5, software: 2.8, red: 3.2, acceso: 1.8, otros: 2.0 },
  ];

  return (
    <ChartContainer
      config={{
        hardware: { color: '#9b87f5', label: 'Hardware' },
        software: { color: '#7E69AB', label: 'Software' },
        red: { color: '#6E59A5', label: 'Red' },
        acceso: { color: '#D6BCFA', label: 'Acceso' },
        otros: { color: '#E5DEFF', label: 'Otros' },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 'auto']} tickFormatter={(value) => `${value}h`} />
          <ChartTooltip 
            content={<ChartTooltipContent />} 
          />
          <Legend />
          {!selectedCategory || selectedCategory === 'Hardware' ? (
            <Line
              type="monotone"
              dataKey="hardware"
              stroke="#9b87f5"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          ) : null}
          {!selectedCategory || selectedCategory === 'Software' ? (
            <Line
              type="monotone"
              dataKey="software"
              stroke="#7E69AB"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          ) : null}
          {!selectedCategory || selectedCategory === 'Red' ? (
            <Line
              type="monotone"
              dataKey="red"
              stroke="#6E59A5"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          ) : null}
          {!selectedCategory || selectedCategory === 'Acceso' ? (
            <Line
              type="monotone"
              dataKey="acceso"
              stroke="#D6BCFA"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          ) : null}
          {!selectedCategory || selectedCategory === 'Otros' ? (
            <Line
              type="monotone"
              dataKey="otros"
              stroke="#E5DEFF"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
