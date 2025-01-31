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
} from '@mui/material';
import { IconCalendarEvent, IconCircle, IconClock, IconEdit } from '@tabler/icons-react';
import moment from 'moment';
import { User } from 'src/types/auth/auth';
import { Link, useNavigate } from 'react-router';
import { Staff } from 'src/types/staff/staff';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { useState } from 'react';
import { FilterFormValues, FilterStatusType } from 'src/types/table/filter/filter';
import TableCard from 'src/components/shared/TableCard';

interface columnType {
  id: string;
  label: string;
  minWidth: number;
}

interface rowType {
  id: number;
  staffId: string;
  user: User;
  updatedAt: string;
  isAssigned: boolean;
}

const columns: columnType[] = [
  { id: 'user', label: 'Benutzerdetails', minWidth: 170 },
  { id: 'phoneNumber', label: 'Telefonnummer', minWidth: 100 },
  { id: 'address', label: 'Adresse', minWidth: 150 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'updatedAt', label: 'Zuletzt aktualisiert', minWidth: 170 },
  { id: 'action', label: 'Aktion', minWidth: 50 },
];

const StaffTable = ({ staff }: { staff: Staff[] }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<FilterStatusType>(FilterStatusType.ALL);

  const rows: rowType[] = staff
    .filter((client) => {
      if (statusFilter === FilterStatusType.ALL) return true;
      return statusFilter === FilterStatusType.ACTIVE ? client.isAssigned : !client.isAssigned;
    })
    .map((staffMember, idx) => ({
      id: idx + 1,
      staffId: staffMember.id,
      user: staffMember.user,
      isAssigned: staffMember.isAssigned,
      updatedAt: staffMember.updatedAt,
    }));

  const handleDownload = () => {
    const headers = ['Benutzerdetails', 'E-Mail', 'Telefonnummer', 'Adresse', 'Status'];
    const rows = staff.map((item: Staff) => [
      `${item.user.firstName} ${item.user.lastName}`,
      item.user.email || 'N/A',
      item.user.phoneNumber || 'N/A',
      item.user.contactDetails || 'N/A',
      item.isAssigned ? 'Aktiv' : 'Inaktiv',
      moment(Number(item.updatedAt)).format('YYYY-MM-DD HH:mm:ss'),
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

  const handleFilter = ({ status }: FilterFormValues) => {
    setStatusFilter(status || FilterStatusType.ALL);
  };

  return (
    <TableCard
      title="Personal Tabelle"
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
                      {moment(Number(row.updatedAt)).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Bearbeiten" placement="left">
                        <IconButton
                          color="success"
                          size="small"
                          component={Link}
                          to={`/staff/${row.staffId}/edit`}
                        >
                          <IconEdit width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Personal Einsatz anzeigen" placement="top">
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/staff/${row.staffId}/schedule`)}
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
      </Box>
    </TableCard>
  );
};

export default StaffTable;
