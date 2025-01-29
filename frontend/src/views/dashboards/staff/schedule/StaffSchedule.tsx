import { useParams } from 'react-router';
import { useEffect } from 'react';
import { Grid2 as Grid } from '@mui/material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ChildCard from 'src/components/shared/ChildCard';
import StaffScheduleFilter from 'src/components/dashboards/staff/schedule/StaffScheduleFilter';
import StaffScheduleListing from 'src/components/dashboards/staff/schedule/StaffScheduleListing';
import { useGetSchedulesByStaffIdQuery } from 'src/services/api/scheduleApi';
import { useDispatch } from 'src/store/Store';
import { setSchedules } from 'src/store/staffSchedule/StaffScheduleSlice';
import ProfileBanner from 'src/components/apps/userprofile/profile/ProfileBanner';
import { useGetStaffQuery } from 'src/services/api/staffApi';

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
  },
];

const StaffSchedule = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: staffData } = useGetStaffQuery({ staffId: id! });
  const { data } = useGetSchedulesByStaffIdQuery({ staffId: id! });
  const user = staffData?.staff.user;

  useEffect(() => {
    if (data && Array.isArray(data.schedulesByStaffId)) {
      dispatch(setSchedules(data.schedulesByStaffId));
    }
  }, [dispatch, data]);

  return (
    <PageContainer
      title="Planung der Personal-Einsätze"
      description="Diese Seite dient der Verwaltung und Planung der Einsätze des Personals"
    >
      <Breadcrumb title="Planung der Personal-Einsätze" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid
          size={{
            sm: 12,
            xs: 12,
          }}
        >
          {user && <ProfileBanner isProfile={false} user={user} />}
        </Grid>

        <Grid
          size={{
            sm: 12,
          }}
        >
          <ChildCard>
            <StaffScheduleFilter />
            <StaffScheduleListing />
          </ChildCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default StaffSchedule;
