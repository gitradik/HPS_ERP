import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableHead,
  Box,
  IconButton,
  Stack,
  Avatar,
  Tooltip,
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import DownloadCard from 'src/components/shared/DownloadCard';
import { Employee } from 'src/types/employee/employee';
import moment from 'moment';
import { Link } from 'react-router';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';

interface columnType {
  id: string;
  label: string;
  minWidth: number;
}

const columns: columnType[] = [
  { id: 'user', label: 'Benutzerdetails', minWidth: 170 },
  { id: 'position', label: 'Position', minWidth: 100 },
  { id: 'phoneNumber', label: 'Telefonnummer', minWidth: 100 },
  { id: 'address', label: 'Adresse', minWidth: 150 },
  // { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'updatedAt', label: 'Zuletzt aktualisiert', minWidth: 170 },
  { id: 'action', label: 'Aktion', minWidth: 50 },
];

const EmployeeTable = ({ employees }: { employees: Employee[] }) => {
  const rows = employees;

  const handleDownload = () => {
    const headers = ['Benutzerdetails', 'E-Mail', 'Position', 'Telefonnummer', 'Adresse'];
    const rows = employees.map((item: Employee) => [
      `${item.user.firstName} ${item.user.lastName}`,
      item.user.email || 'N/A',
      item.user.position || 'N/A',
      item.user.phoneNumber || 'N/A',
      item.user.contactDetails || 'N/A',
      moment(Number(item.updatedAt)).format('YYYY-MM-DD HH:mm:ss'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');

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
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    <Typography variant="h6">{column.label}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={getUploadsImagesProfilePath(row.user.photo)}
                        alt={row.user.photo}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Stack direction="column" spacing={1}>
                        <Typography variant="body1" color="textSecondary">
                          {row.user.firstName} {row.user.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {row.user.email}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {row.user.position || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {row.user.phoneNumber || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {row.user.contactDetails || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {moment(Number(row.updatedAt)).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Bearbeiten" placement="left">
                      <IconButton
                        color="success"
                        size="small"
                        component={Link}
                        to={`/employees/${row.id}/edit`}
                      >
                        <IconEdit width={22} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DownloadCard>
  );
};

export default EmployeeTable;
