
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const PieChartView: React.FC = () => {
  // Mock data for satisfaction
  const data = [
    { name: 'Muy Satisfecho', value: 60, fill: '#65B741' },
    { name: 'Satisfecho', value: 25, fill: '#C1F2B0' },
    { name: 'Neutral', value: 10, fill: '#FFC436' },
    { name: 'Insatisfecho', value: 5, fill: '#FF8C8C' },
  ];

  return (
    <ChartContainer
      config={{
        'muy-satisfecho': { color: '#65B741', label: 'Muy Satisfecho' },
        'satisfecho': { color: '#C1F2B0', label: 'Satisfecho' },
        'neutral': { color: '#FFC436', label: 'Neutral' },
        'insatisfecho': { color: '#FF8C8C', label: 'Insatisfecho' },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip 
            content={<ChartTooltipContent />} 
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
