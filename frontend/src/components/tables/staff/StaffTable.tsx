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
  Chip,
  Tooltip,
  Pagination,
  TableSortLabel,
} from '@mui/material';
import { IconCalendarEvent, IconCircle, IconClock, IconEdit } from '@tabler/icons-react';
import moment from 'moment';
import { Link, useNavigate } from 'react-router';
import { Staff } from 'src/types/staff/staff';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import TableCard from 'src/components/shared/tableCards/TableCard';
import { ColumnType } from 'src/types/table/column';
import { useStaffSortOrder } from 'src/hooks/staff/useStaffSortOrder';
import { useStaffPagination } from 'src/hooks/staff/useStaffPagination';
import { useStaffFilters } from 'src/hooks/staff/useStaffFilters';

const columns: ColumnType[] = [
  { id: 'user', label: 'Benutzerdetails', minWidth: 170 },
  { id: 'phoneNumber', label: 'Telefonnummer', minWidth: 100 },
  { id: 'address', label: 'Adresse', minWidth: 150 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'createdAt', label: 'Erstelldatum', minWidth: 170 },
  { id: 'action', label: 'Aktion', minWidth: 50 },
];

const StaffTable = ({ staffs, totalCount }: { staffs: Staff[]; totalCount: number }) => {
  const navigate = useNavigate();
  const { handleSort, getDirection, getSortDirection, isActiveDirection } = useStaffSortOrder();
  const { handlePageChange, page, count } = useStaffPagination(totalCount);
  const { handleFilter, defaultValues } = useStaffFilters();

  const items = staffs;

  const handleDownload = () => {
    const headers = [
      'Benutzerdetails',
      'E-Mail',
      'Telefonnummer',
      'Adresse',
      'Status',
      'Erstelldatum',
    ];
    const rows = items.map((item: Staff) => [
      `${item.user.firstName} ${item.user.lastName}`,
      item.user.email || 'N/A',
      item.user.phoneNumber || 'N/A',
      item.user.contactDetails || 'N/A',
      item.isAssigned ? 'Aktiv' : 'Inaktiv',
      moment(Number(item.createdAt)).format('YYYY-MM-DD HH:mm:ss'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Personal-Daten.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TableCard
      title="Personal Tabelle"
      onDownload={handleDownload}
      defaultValues={defaultValues}
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
                <TableCell key={columns[1].id} style={{ minWidth: columns[1].minWidth }}>
                  <Typography variant="h6">{columns[1].label}</Typography>
                </TableCell>
                <TableCell key={columns[2].id} style={{ minWidth: columns[2].minWidth }}>
                  <Typography variant="h6">{columns[2].label}</Typography>
                </TableCell>

                <TableCell
                  style={{ minWidth: columns[3].minWidth }}
                  sortDirection={getSortDirection('isAssigned')}
                >
                  <TableSortLabel
                    active={isActiveDirection('isAssigned')}
                    direction={getDirection('isAssigned')}
                    onClick={() => handleSort('isAssigned')}
                  >
                    <Typography variant="h6">{columns[3].label}</Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  style={{ minWidth: columns[4].minWidth }}
                  sortDirection={getSortDirection(columns[4].id)}
                >
                  <TableSortLabel
                    active={isActiveDirection(columns[4].id)}
                    direction={getDirection(columns[4].id)}
                    onClick={() => handleSort(columns[4].id)}
                  >
                    <Typography variant="h6">{columns[4].label}</Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell style={{ minWidth: columns[5].minWidth }}>
                  <Typography variant="h6">{columns[5].label}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={getUploadsImagesProfilePath(row.user.photo)}
                        alt={row.user.photo}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Stack direction="column" spacing={1}>
                        <Typography variant="subtitle1" color="textSecondary">
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
                      {row.user.phoneNumber || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {row.user.contactDetails || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.isAssigned ? 'Aktiv' : 'Inaktiv'}
                      size="small"
                      icon={row.isAssigned ? <IconCircle width={14} /> : <IconClock width={14} />}
                      sx={{
                        backgroundColor: row.isAssigned
                          ? (theme) => theme.palette.success.light
                          : (theme) => theme.palette.grey[100],
                        color: row.isAssigned
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
                      {moment(Number(row.createdAt)).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Bearbeiten" placement="left">
                        <IconButton
                          color="success"
                          size="small"
                          component={Link}
                          to={`/staff/${row.id}/edit`}
                        >
                          <IconEdit width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Personal Einsatz anzeigen" placement="top">
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/staff/${row.id}/schedule`)}
                          size="small"
                        >
                          <IconCalendarEvent width={22} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
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
    </TableCard>
  );
};

export default StaffTable;
