
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TicketTableProps {
  selectedCategory: string | null;
}

export const TicketTable: React.FC<TicketTableProps> = ({ selectedCategory }) => {
  // Mock data for recurring issues
  const data = [
    { id: 1, issue: 'Problemas de conexión WiFi', category: 'Red', count: 45 },
    { id: 2, issue: 'Acceso denegado al sistema académico', category: 'Acceso', count: 38 },
    { id: 3, issue: 'Impresora no funciona', category: 'Hardware', count: 32 },
    { id: 4, issue: 'Bloqueo de cuenta', category: 'Acceso', count: 29 },
    { id: 5, issue: 'Computadora lenta', category: 'Hardware', count: 27 },
    { id: 6, issue: 'Error al instalar software', category: 'Software', count: 24 },
    { id: 7, issue: 'Problema con proyector', category: 'Hardware', count: 22 },
    { id: 8, issue: 'Virus/Malware', category: 'Software', count: 19 },
    { id: 9, issue: 'Error en plataforma educativa', category: 'Software', count: 17 },
    { id: 10, issue: 'Problema con micrófono/cámara', category: 'Hardware', count: 15 },
  ];

  // Filter data based on selected category
  const filteredData = selectedCategory
    ? data.filter(item => item.category === selectedCategory)
    : data;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Incidencia</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-right">Conteo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>{item.issue}</TableCell>
            <TableCell>
              <Badge variant="outline" className={
                item.category === 'Hardware' ? 'bg-[#9b87f5] text-white' :
                item.category === 'Software' ? 'bg-[#7E69AB] text-white' :
                item.category === 'Red' ? 'bg-[#6E59A5] text-white' :
                item.category === 'Acceso' ? 'bg-[#D6BCFA]' :
                'bg-[#E5DEFF]'
              }>
                {item.category}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{item.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
