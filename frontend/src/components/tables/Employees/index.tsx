import * as React from 'react';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableHead,
  Box,
} from '@mui/material';
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from '@tanstack/react-table';
import DownloadCard from 'src/components/shared/DownloadCard';
import { Employee } from 'src/types/employee/employee';
import moment from 'moment';


const columnHelper = createColumnHelper<Employee>();

const columns = [
  columnHelper.accessor('user', {
    header: () => 'Benutzerdetails', // User Details
    cell: (info) => (
      <Box>
        <Typography variant="h6" fontWeight="600" mb={1}>
          {info.row.original.user.firstName} {info.row.original.user.lastName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {info.row.original.user.email}
        </Typography>
      </Box>
    ),
  }),
  columnHelper.accessor('user', {
    header: () => 'Position', // Position
    cell: (info) => (
      <Typography variant="body2" color="textSecondary">
        {info.getValue().position || 'N/A'}
      </Typography>
    ),
  }),
  columnHelper.accessor('user', {
    header: () => 'Adresse', // Address
    cell: (info) => (
      <Typography variant="body2" color="textSecondary">
        {info.getValue().contactDetails || 'N/A'}
      </Typography>
    ),
  }),
  columnHelper.accessor('user', {
    header: () => 'Status', // Status
    cell: (info) => (
      <Typography color={info.getValue().isActive ? 'green' : 'red'} variant="body2">
        {info.getValue().isActive ? 'Aktiv' : 'Inaktiv'}
      </Typography>
    ),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => 'Zuletzt aktualisiert', // Last Updated
    cell: (info) => (
      <Typography variant="body2" color="textSecondary">
        {moment(Number(info.getValue())).format('YYYY-MM-DD HH:mm:ss')}
      </Typography>
    ),
  }),
];

const EmployeesTable = ({ employees }: { employees: Employee[] }) => {
  const [data] = React.useState<any>(employees);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDownload = () => {
    const headers = ['Benutzerdetails', 'Position', 'Adresse', 'Status', 'Zuletzt aktualisiert'];
    const rows = data.map((item: Employee) => [
      `${item.user.firstName} ${item.user.lastName}`,
      item.user.position || 'N/A',
      item.user.contactDetails || 'N/A',
      item.user.isActive ? 'Aktiv' : 'Inaktiv',
      moment(Number(item.updatedAt)).format('YYYY-MM-DD HH:mm:ss'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((e: any[]) => e.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mitarbeiter-Daten.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DownloadCard title="Mitarbeiter Tabelle" onDownload={handleDownload}>
      <Box>
        <TableContainer>
        <Table sx={{ whiteSpace: 'nowrap' }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup, idx: number) => (
              <TableRow key={`EmployeesTableHeadRow-${headerGroup.id}-${idx}`}>
                {headerGroup.headers.map((header, idxChild) => (
                  <TableCell key={`EmployeesTableHeadCell-${headerGroup.id}-${header.id}-${idxChild}`}>
                    <Typography variant="h6">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, idx) => (
              <TableRow key={`EmployeesTableRow-${row.original.user.id}-${idx}`}>
                {row.getVisibleCells().map((cell, idxChild) => (
                  <TableCell key={`EmployeesTableCell-${row.original.user.id}-${cell.column.id}-${idxChild}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        </TableContainer>
      </Box>
    </DownloadCard>
  );
};

export default EmployeesTable;
