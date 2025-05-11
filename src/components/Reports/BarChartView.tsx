
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface BarChartViewProps {
  onCategoryClick: (category: string) => void;
  selectedCategory: string | null;
}

export const BarChartView: React.FC<BarChartViewProps> = ({ onCategoryClick, selectedCategory }) => {
  // Mock data
  const data = [
    { name: 'Hardware', value: 120, fill: '#9b87f5' },
    { name: 'Software', value: 98, fill: '#7E69AB' },
    { name: 'Red', value: 86, fill: '#6E59A5' },
    { name: 'Acceso', value: 56, fill: '#D6BCFA' },
    { name: 'Otros', value: 24, fill: '#E5DEFF' },
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
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey="value"
            onClick={(data) => onCategoryClick(data.name)}
            cursor="pointer"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill} 
                opacity={selectedCategory === null || selectedCategory === entry.name ? 1 : 0.4} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
