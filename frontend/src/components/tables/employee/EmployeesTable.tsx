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
  Pagination,
  TableSortLabel,
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import DownloadCard from 'src/components/shared/DownloadCard';
import { Employee } from 'src/types/employee/employee';
import moment from 'moment';
import { Link } from 'react-router';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { ColumnType } from 'src/types/table/column';
import { useEmployeePagination } from 'src/hooks/employee/useEmployeePagination';
import { useEmployeeSortOrder } from 'src/hooks/employee/useEmployeeSortOrder';

const columns: ColumnType[] = [
  { id: 'user', label: 'Benutzerdetails', minWidth: 170 },
  { id: 'position', label: 'Position', minWidth: 100 },
  { id: 'phoneNumber', label: 'Telefonnummer', minWidth: 100 },
  { id: 'address', label: 'Adresse', minWidth: 150 },
  { id: 'createdAt', label: 'Erstelldatum', minWidth: 170 },
  { id: 'action', label: 'Aktion', minWidth: 50 },
];

const EmployeeTable = ({
  employees,
  totalCount,
}: {
  employees: Employee[];
  totalCount: number;
}) => {
  const { handleSort, getDirection, getSortDirection, isActiveDirection } = useEmployeeSortOrder();
  const { handlePageChange, page, count } = useEmployeePagination(totalCount);

  const rows = employees;

  const handleDownload = () => {
    const headers = [
      'Benutzerdetails',
      'E-Mail',
      'Position',
      'Telefonnummer',
      'Adresse',
      'Erstelldatum',
    ];
    const rows = employees.map((item: Employee) => [
      `${item.user.firstName} ${item.user.lastName}`,
      item.user.email || 'N/A',
      item.user.position || 'N/A',
      item.user.phoneNumber || 'N/A',
      item.user.contactDetails || 'N/A',
      moment(Number(item.createdAt)).format('YYYY-MM-DD HH:mm:ss'),
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
                <TableCell key={columns[0].id} style={{ minWidth: columns[0].minWidth }}>
                  <Typography variant="h6">{columns[0].label}</Typography>
                </TableCell>

                <TableCell key={columns[1].id} style={{ minWidth: columns[1].minWidth }}>
                  <Typography variant="h6">{columns[1].label}</Typography>
                </TableCell>

                <TableCell key={columns[2].id} style={{ minWidth: columns[2].minWidth }}>
                  <Typography variant="h6">{columns[2].label}</Typography>
                </TableCell>

                <TableCell key={columns[3].id} style={{ minWidth: columns[3].minWidth }}>
                  <Typography variant="h6">{columns[3].label}</Typography>
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
                      {moment(Number(row.createdAt)).format('YYYY-MM-DD HH:mm:ss')}
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
        <Box my={3} display="flex" justifyContent={'center'}>
          <Pagination count={count} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      </Box>
    </DownloadCard>
  );
};

export default EmployeeTable;
