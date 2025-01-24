import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableHead,
  Box,
  Chip,
  Stack,
  Avatar,
  IconButton,
} from '@mui/material';
import { IconCircle, IconClock, IconEye } from '@tabler/icons-react';
import moment from 'moment';
import TableCard from 'src/components/shared/TableCard';
import { Client } from 'src/types/client/client';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { FilterFormValues, FilterStatusType } from 'src/types/table/filter/filter';

interface columnType {
  id: string;
  label: string;
  minWidth: number;
}

// Kunden → FirstName LastName Email PhoneNumber Address Status(работаем с клиентом или на паузе)
const columns: columnType[] = [
  { id: 'user', label: 'Benutzerdetails', minWidth: 170 },
  { id: 'companyName', label: 'Name der Firma', minWidth: 170 },
  { id: 'phoneNumber', label: 'Telefonnummer', minWidth: 100 },
  { id: 'address', label: 'Adresse', minWidth: 150 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'updatedAt', label: 'Zuletzt aktualisiert', minWidth: 170 },
  { id: 'action', label: 'Aktion', minWidth: 50 },
];

const ClientsTable = ({ clients }: { clients: Client[] }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<FilterStatusType>('all'); // Состояние фильтра

  const filteredRows = clients.filter((client) => {
    if (statusFilter === 'all') return true;
    return statusFilter === 'active' ? client.isWorking : !client.isWorking;
  });

  const handleDownload = () => {
    const headers = [
      'Benutzerdetails',
      'E-Mail',
      'Name der Firma',
      'Telefonnummer',
      'Adresse',
      'Status',
    ];
    const rows = clients.map((item: Client) => [
      `${item.user.firstName} ${item.user.lastName}`,
      item.user.email || 'N/A',
      item.companyName || 'N/A',
      item.user.phoneNumber || 'N/A',
      item.user.contactDetails || 'N/A',
      item.isWorking ? 'Aktiv' : 'Inaktiv',
      moment(Number(item.updatedAt)).format('YYYY-MM-DD HH:mm:ss'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Kunden-Daten.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilter = ({ status }: FilterFormValues) => {
    setStatusFilter(status || 'all');
  };

  return (
    <TableCard
      title="Kunden Tabelle"
      onDownload={handleDownload}
      defaultValues={{
        status: statusFilter,
      }}
      onFilterSubmit={handleFilter}
    >
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
              {filteredRows.map((client, idx) => (
                <TableRow key={client.id + idx}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={getUploadsImagesProfilePath(client.user.photo)}
                        alt={client.user.photo}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Stack direction="column" spacing={1}>
                        <Typography variant="subtitle1" color="textSecondary">
                          {client.user.firstName} {client.user.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {client.user.email}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {client.companyName || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {client.user.phoneNumber || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {client.user.contactDetails || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={client.isWorking ? 'Aktiv' : 'Inaktiv'}
                      size="small"
                      icon={client.isWorking ? <IconCircle width={14} /> : <IconClock width={14} />}
                      sx={{
                        backgroundColor: client.isWorking
                          ? (theme) => theme.palette.success.light
                          : (theme) => theme.palette.grey[100],
                        color: client.isWorking
                          ? (theme) => theme.palette.success.main
                          : (theme) => theme.palette.grey[500],
                        '.MuiChip-icon': {
                          color: 'inherit !important',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {moment(Number(client.updatedAt)).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      <IconButton onClick={() => navigate(`/clients/${client.id}`)} size="small">
                        <IconEye />
                      </IconButton>
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </TableCard>
  );
};

export default ClientsTable;
