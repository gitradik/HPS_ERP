import { Box, Grid2 as Grid, Typography, styled } from '@mui/material';
import { useDispatch, useSelector } from 'src/store/Store';
import { Schedule, ScheduleStatus } from 'src/types/schedule/schedule';
import { selectSchedules, setVisibilityFilter } from 'src/store/staffSchedule/StaffScheduleSlice';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const StaffScheduleFilter = () => {
  const dispatch = useDispatch();
  const schedules: Schedule[] = useSelector(selectSchedules);
  const pendingSchedules = schedules.filter((s) => s.status === ScheduleStatus.PENDING).length;
  const openSchedules = schedules.filter((s) => s.status === ScheduleStatus.OPEN).length;
  const closedSchedules = schedules.filter((s) => s.status === ScheduleStatus.CLOSED).length;

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('all'))}
          sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
        >
          <Typography variant="h3">{schedules.length}</Typography>
          <Typography variant="h6">Gesamteinsätze</Typography>
        </BoxStyled>
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter(ScheduleStatus.PENDING))}
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h3">{pendingSchedules}</Typography>
          <Typography variant="h6">Ausstehende Einsätze</Typography>
        </BoxStyled>
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter(ScheduleStatus.OPEN))}
          sx={{ backgroundColor: 'success.light', color: 'success.main' }}
        >
          <Typography variant="h3">{openSchedules}</Typography>
          <Typography variant="h6">Offene Einsätze</Typography>
        </BoxStyled>
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter(ScheduleStatus.CLOSED))}
          sx={{ backgroundColor: 'error.light', color: 'error.main' }}
        >
          <Typography variant="h3">{closedSchedules}</Typography>
          <Typography variant="h6">Abgeschlossene Einsätze</Typography>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default StaffScheduleFilter;
