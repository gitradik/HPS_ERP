import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import ScheduleSetting from 'src/components/dashboards/schedule/ScheduleSetting';
import { useParams } from 'react-router';

const StaffScheduleEdit = () => {
  const { id, scheduleId } = useParams();

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
      title: 'Einsatz bearbeiten',
    },
  ];

  return (
    <PageContainer
      title="Einsatz bearbeiten"
      description="Bearbeiten Sie hier die Einsatzdetails für das Personal."
    >
      <Breadcrumb title="Einsatz bearbeiten" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <ScheduleSetting scheduleId={scheduleId!} />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default StaffScheduleEdit;
