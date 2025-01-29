import { useParams } from 'react-router';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import {
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  Chip,
  Divider,
  Grid2 as Grid,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router';
import { useGetScheduleQuery } from 'src/services/api/scheduleApi';
import { Schedule, ScheduleStatus } from 'src/types/schedule/schedule';
import { useTranslation } from 'react-i18next';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const StaffScheduleDetail = () => {
  const { id, scheduleId } = useParams();
  const { t } = useTranslation();

  const BCrumb = [
    {
      to: '/',
      title: 'Startseite',
    },
    {
      to: '/staff',
      title: 'Personal verwalten',
    },
    {
      title: 'Einsatzplan',
      to: `/staff/${id}/schedule`,
    },
    {
      title: 'Einsatz Detail',
    },
  ];

  const { data: schedulesData } = useGetScheduleQuery({ scheduleId: scheduleId! });
  const schedule = scheduleId ? schedulesData?.schedule : undefined;

  const scheduleColor = (s: Schedule) =>
    s.status === ScheduleStatus.OPEN
      ? 'success'
      : s.status === ScheduleStatus.CLOSED
        ? 'error'
        : s.status === ScheduleStatus.PENDING
          ? 'warning'
          : 'primary';

  return (
    <PageContainer
      title="Einsatz Detail"
      description="Detaillierte Informationen zum aktuellen Einsatz."
    >
      <Breadcrumb title="Einsatz Detail" items={BCrumb} />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box
          sx={{
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
          }}
        >
          <Typography variant="h5"># {schedule?.title}</Typography>
          <Box mt={1}>
            <Chip
              size="small"
              color="secondary"
              variant="outlined"
              label={`${dayjs(Number(schedule?.start)).format('DD MMM YYYY')} - ${dayjs(Number(schedule?.end)).format('DD MMM YYYY')}`}
            ></Chip>
          </Box>
        </Box>

        {schedule && (
          <Box textAlign="right">
            <Chip
              size="small"
              color={scheduleColor(schedule)}
              label={t(`ScheduleStatus.${schedule.status}`)}
            />
          </Box>
        )}
      </Stack>
      <Divider></Divider>
      <Grid container spacing={3} mt={2} mb={4}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Paper variant="outlined" sx={{ height: '100%' }}>
            <Box p={3} display="flex" flexDirection="column" gap="4px">
              <Typography variant="h6" mb={2}>
                Kunden :
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  src={getUploadsImagesProfilePath(schedule?.client.user.photo)}
                  alt={schedule?.client.user.photo}
                  sx={{ width: 60, height: 60 }}
                />
                <Stack>
                  <Typography variant="h6" color="textSecondary">
                    {schedule?.client.user.firstName} {schedule?.client.user.lastName}
                  </Typography>
                  {schedule?.client.companyName && (
                    <Typography variant="body1" color="info">
                      {schedule?.client.companyName}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              <Stack mt={2} direction="column" spacing={1}>
                <Typography variant="body1">{schedule?.client.user.email}</Typography>
                {schedule?.client.user.phoneNumber && (
                  <Typography variant="body1">{schedule?.client.user.phoneNumber}</Typography>
                )}
                {schedule?.client.user.contactDetails && (
                  <Typography variant="body1">{schedule?.client.user.contactDetails}</Typography>
                )}
              </Stack>
            </Box>
          </Paper>
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Paper variant="outlined" sx={{ height: '100%' }}>
            <Box p={3} display="flex" flexDirection="column" gap="4px">
              <Typography variant="h6" mb={2}>
                Personal :
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  src={getUploadsImagesProfilePath(schedule?.staff.user.photo)}
                  alt={schedule?.staff.user.photo}
                  sx={{ width: 60, height: 60 }}
                />
                <Stack>
                  <Typography variant="h6" color="textSecondary">
                    {schedule?.staff.user.firstName} {schedule?.staff.user.lastName}
                  </Typography>
                  {schedule?.staff.user.position && (
                    <Typography variant="body1" color="info">
                      {schedule?.staff.user.position}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              <Stack mt={2} direction="column" spacing={1}>
                <Typography variant="body1">{schedule?.staff.user.email}</Typography>
                {schedule?.staff.user.phoneNumber && (
                  <Typography variant="body1">{schedule?.staff.user.phoneNumber}</Typography>
                )}
                {schedule?.staff.user.contactDetails && (
                  <Typography variant="body1">{schedule?.staff.user.contactDetails}</Typography>
                )}
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box display="flex" alignItems="center" gap={1} mt={3} justifyContent="end">
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to={`/staff/${id}/schedule/${scheduleId}/edit`}
        >
          Einsatz bearbeiten
        </Button>
        <Button variant="contained" color="primary" component={Link} to={`/staff/${id}/schedule`}>
          Zurück zur Einsatzliste
        </Button>
      </Box>
    </PageContainer>
  );
};

export default StaffScheduleDetail;
