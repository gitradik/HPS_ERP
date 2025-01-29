// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Chip,
  Stack,
  Avatar,
  TextField,
  useTheme,
  TableContainer,
  IconButton,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { Schedule, ScheduleStatus } from 'src/types/schedule/schedule';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import {
  selectCurrentFilter,
  selectSchedules,
  selectScheduleSearch,
  setSearchSchedule,
} from 'src/store/staffSchedule/StaffScheduleSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { Link, useParams } from 'react-router';
import { useDeleteScheduleMutation } from 'src/services/api/scheduleApi';

const StaffScheduleListing = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const schedules = useSelector(selectSchedules);
  const currentFilter = useSelector(selectCurrentFilter);
  const scheduleSearch = useSelector(selectScheduleSearch);
  const [deleteSchedule] = useDeleteScheduleMutation();

  const getVisibleSchedules = (schedules: Schedule[], filter: string, scheduleSearch: string) => {
    switch (filter) {
      case 'all':
        return schedules.filter((c) => c.title.toLocaleLowerCase().includes(scheduleSearch));

      case ScheduleStatus.PENDING:
        return schedules.filter(
          (c) =>
            c.status === ScheduleStatus.PENDING &&
            c.title.toLocaleLowerCase().includes(scheduleSearch),
        );

      case ScheduleStatus.CLOSED:
        return schedules.filter(
          (c) =>
            c.status === ScheduleStatus.CLOSED &&
            c.title.toLocaleLowerCase().includes(scheduleSearch),
        );

      case ScheduleStatus.OPEN:
        return schedules.filter(
          (c) =>
            c.status === ScheduleStatus.OPEN &&
            c.title.toLocaleLowerCase().includes(scheduleSearch),
        );

      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  };

  const visibleSchedules = getVisibleSchedules(schedules, currentFilter, scheduleSearch);

  const scheduleBadge = (schedule: Schedule) =>
    schedule.status === ScheduleStatus.OPEN
      ? theme.palette.success.light
      : schedule.status === ScheduleStatus.CLOSED
        ? theme.palette.error.light
        : schedule.status === ScheduleStatus.PENDING
          ? theme.palette.warning.light
          : 'primary';

  const handleDelete = async (sheduleId: string) => {
    try {
      await deleteSchedule({ id: sheduleId });
      enqueueSnackbar('Die Veranstaltung wurde erfolgreich gelöscht!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };

  return (
    <Box mt={4}>
      <Box sx={{ maxWidth: '260px', ml: 'auto' }} mb={3}>
        <TextField
          size="small"
          label="Search"
          fullWidth
          onChange={(e) => dispatch(setSearchSchedule(e.target.value))}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Title</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Kunden</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Status</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Date Start</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Date End</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleSchedules.map((schedule, idx) => (
              <TableRow key={`StaffScheduleListing-${schedule.id}${idx}`} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight={600} noWrap>
                      {schedule.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      noWrap
                      sx={{ maxWidth: '250px' }}
                      variant="subtitle2"
                      fontWeight={400}
                    >
                      {/* {schedule.scheduleDescription} */}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" gap="10px" alignItems="center">
                    <Avatar
                      src={getUploadsImagesProfilePath(schedule.client.user.photo)}
                      alt={schedule.client.user.photo}
                      sx={{
                        borderRadius: '100%',
                        height: 25,
                        width: 25,
                      }}
                    />
                    <Typography variant="body1">
                      {schedule.client.user.firstName} {schedule.client.user.lastName}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      backgroundColor: scheduleBadge(schedule),
                    }}
                    size="small"
                    label={t(`ScheduleStatus.${schedule.status}`)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {dayjs(Number(schedule.start)).format('DD MMM YYYY')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {dayjs(Number(schedule.end)).format('DD MMM YYYY')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Bearbeiten" placement="left">
                      <IconButton
                        color="success"
                        size="small"
                        component={Link}
                        to={`/staff/${id}/schedule/${schedule.id}/edit`}
                      >
                        <IconEdit width={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Einsatzdetails einsehen" placement="top">
                      <IconButton
                        color="info"
                        size="small"
                        component={Link}
                        to={`/staff/${id}/schedule/${schedule.id}`}
                      >
                        <IconEye width={22} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Einsatz löschen">
                      <IconButton color="error" onClick={() => handleDelete(schedule.id)}>
                        <IconTrash width={22} />
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
  );
};

export default StaffScheduleListing;
