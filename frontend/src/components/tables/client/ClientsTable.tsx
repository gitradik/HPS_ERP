import { Link } from 'react-router';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Typography,
  TableHead,
  Box,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Pagination,
} from '@mui/material';
import { IconCircle, IconClock, IconEdit, IconForbid } from '@tabler/icons-react';
import moment from 'moment';
import { Client, ClientStatus } from 'src/types/client/client';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { ColumnType } from 'src/types/table/column';
import { useClinetFilters } from 'src/hooks/client/useClientFilters';
import ClientTableCard from 'src/components/shared/tableCards/ClientTableCard';
import { useClientPagination } from 'src/hooks/client/useClientPagination';
import { useClientSortOrder } from 'src/hooks/client/useClientSortOrder';
import { useTranslation } from 'react-i18next';

const columns: ColumnType[] = [
  { id: 'user', label: 'Benutzerdetails', minWidth: 170 },
  { id: 'companyName', label: 'Name der Firma', minWidth: 170 },
  { id: 'phoneNumber', label: 'Telefonnummer', minWidth: 100 },
  { id: 'address', label: 'Adresse', minWidth: 150 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'createdAt', label: 'Erstelldatum', minWidth: 170 },
  { id: 'action', label: 'Aktion', minWidth: 50 },
];

const ClientsTable = ({ clients, totalCount }: { clients: Client[]; totalCount: number }) => {
  const { t } = useTranslation();
  const { handleSort, getDirection, getSortDirection, isActiveDirection } = useClientSortOrder();
  const { handlePageChange, page, count } = useClientPagination(totalCount);
  const { handleFilter, defaultValues } = useClinetFilters();

  const filteredRows = clients;

  const handleDownload = () => {
    const headers = [
      'Benutzerdetails',
      'E-Mail',
      'Name der Firma',
      'Telefonnummer',
      'Adresse',
      'Status',
      'Erstelldatum',
    ];
    const rows = clients.map((item: Client) => [
      `${item.user.firstName} ${item.user.lastName}`,
      item.user.email || 'N/A',
      item.companyName || 'N/A',
      item.user.phoneNumber || 'N/A',
      item.user.contactDetails || 'N/A',
      item.status,
      moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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

  return (
    <ClientTableCard
      title="Kunden Tabelle"
      defaultValues={defaultValues}
      onDownload={handleDownload}
      onFilterSubmit={handleFilter}
    >
      <Box>
        <TableContainer>
          <Table sx={{ whiteSpace: 'nowrap' }}>
            <TableHead>
              <TableRow>
                <TableCell key={columns[0].id} style={{ minWidth: columns[0].minWidth }}>
                  <Typography variant="h6">{columns[0].label}</Typography>
                </TableCell>

                <TableCell
                  style={{ minWidth: columns[1].minWidth }}
                  sortDirection={getSortDirection(columns[1].id)}
                >
                  <TableSortLabel
                    active={isActiveDirection(columns[1].id)}
                    direction={getDirection(columns[1].id)}
                    onClick={() => handleSort(columns[1].id)}
                  >
                    <Typography variant="h6">{columns[1].label}</Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell key={columns[2].id} style={{ minWidth: columns[2].minWidth }}>
                  <Typography variant="h6">{columns[2].label}</Typography>
                </TableCell>

                <TableCell key={columns[3].id} style={{ minWidth: columns[3].minWidth }}>
                  <Typography variant="h6">{columns[3].label}</Typography>
                </TableCell>

                <TableCell
                  style={{ minWidth: columns[4].minWidth }}
                  sortDirection={getSortDirection('status')}
                >
                  <TableSortLabel
                    active={isActiveDirection('status')}
                    direction={getDirection('status')}
                    onClick={() => handleSort('status')}
                  >
                    <Typography variant="h6">{columns[4].label}</Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  style={{ minWidth: columns[5].minWidth }}
                  sortDirection={getSortDirection(columns[5].id)}
                >
                  <TableSortLabel
                    active={isActiveDirection(columns[5].id)}
                    direction={getDirection(columns[5].id)}
                    onClick={() => handleSort(columns[5].id)}
                  >
                    <Typography variant="h6">{columns[5].label}</Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell style={{ minWidth: columns[6].minWidth }}>
                  <Typography variant="h6">{columns[6].label}</Typography>
                </TableCell>
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
                      label={
                        client.status === ClientStatus.BLACKLIST
                          ? t(`ClientStatus.${ClientStatus.BLACKLIST}`)
                          : client.status === ClientStatus.ACTIVE
                            ? t(`ClientStatus.${ClientStatus.ACTIVE}`)
                            : t(`ClientStatus.${ClientStatus.INACTIVE}`)
                      }
                      size="small"
                      icon={
                        client.status === ClientStatus.BLACKLIST ? (
                          <IconForbid width={14} />
                        ) : client.status === ClientStatus.ACTIVE ? (
                          <IconCircle width={14} />
                        ) : (
                          <IconClock width={14} />
                        )
                      }
                      sx={{
                        backgroundColor:
                          client.status === ClientStatus.BLACKLIST
                            ? (theme) => theme.palette.grey[600]
                            : client.status === ClientStatus.ACTIVE
                              ? (theme) => theme.palette.success.light
                              : (theme) => theme.palette.grey[100],
                        color:
                          client.status === ClientStatus.BLACKLIST
                            ? (theme) => theme.palette.grey[100]
                            : client.status === ClientStatus.ACTIVE
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
                      {moment(client.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Bearbeiten" placement="left">
                      <IconButton
                        color="success"
                        size="small"
                        component={Link}
                        to={`/clients/${client.id}/edit`}
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
        <Box my={3} display="flex" justifyContent={'center'}>
          <Pagination count={count} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      </Box>
    </ClientTableCard>
  );
};

export default ClientsTable;
