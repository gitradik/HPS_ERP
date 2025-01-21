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
  Badge,
  Stack,
} from '@mui/material';
import {
  IconEye,
} from '@tabler/icons-react';
import DownloadCard from 'src/components/shared/DownloadCard';
import moment from 'moment';
import { User } from 'src/types/auth/auth';
import { useNavigate } from 'react-router';
import { Client } from 'src/types/client/client';

interface columnType {
  id: string;
  label: string;
  minWidth: number;
}

interface rowType {
  id: number;
  clientId: string;
  user: User;
  updatedAt: string;
  companyName?: string;
  isWorking: boolean;
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

  const rows: rowType[] = clients.map((client, idx) => ({
    id: idx + 1,
    clientId: client.id,
    user: client.user,
    companyName: client.companyName,
    isWorking: client.isWorking,
    updatedAt: client.updatedAt,
  }));

  const handleDownload = () => {
    const headers = ['Benutzerdetails', 'E-Mail', 'Name der Firma', 'Telefonnummer', 'Adresse', 'Status', 'Zuletzt aktualisiert'];
    const rows = clients.map((item: Client) => [
      `${item.user.firstName} ${item.user.lastName}`,
      item.user.email || 'N/A',
      item.companyName || 'N/A',
      item.user.phoneNumber || 'N/A',
      item.user.contactDetails || 'N/A',
      item.isWorking ? 'Aktiv' : 'Inaktiv',
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
    link.setAttribute('download', 'Kunden-Daten.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DownloadCard title="Kunden Tabelle" onDownload={handleDownload}>
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
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.user.firstName} {row.user.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {row.user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {row.companyName || 'N/A'}
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
                    <Stack spacing={1} direction="row" alignItems="center">
                      <Badge
                        color={
                          row.isWorking
                            ? 'success'
                            : 'error'
                        }
                        variant="dot"
                      ></Badge>
                      <Typography color="textSecondary" variant="body1">
                        {row.isWorking ? 'Aktiv' : 'Inaktiv'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {moment(Number(row.updatedAt)).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      <IconButton onClick={() => navigate(`/clients/${row.clientId}`)} size="small"> <IconEye/></IconButton>
                    </Typography>
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

export default ClientsTable;
