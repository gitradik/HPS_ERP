import { Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { Timeline } from 'src/components/dashboards/schedule/timeline/Timeline';
import { TimelineEvents } from 'src/components/dashboards/schedule/timeline/TimelineEvents';
import { useGetSchedulesByStaffIdsQuery } from 'src/services/api/scheduleApi';
import { useGetStaffsQuery } from 'src/services/api/staffApi';

export const ScheduleTimeline = () => {
  const { data: staffsData } = useGetStaffsQuery({ filters: { isAssigned: true } });
  const { data } = useGetSchedulesByStaffIdsQuery(
    { staffIds: staffsData?.items.map((item) => item.id) || [] },
    { skip: !staffsData },
  );

  const schedules = data?.schedulesByStaffIds || [];

  const [startDate, setStartDate] = useState(moment());
  const [visibleItems] = useState(12);

  const handleWheel = (e: any) => {
    const unit = 'week';

    const newStartDate =
      e.deltaY < 0 ? startDate.clone().subtract(1, unit) : startDate.clone().add(1, unit);

    setStartDate(newStartDate);
  };

  return (
    <Box
    mt={1}
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
      onWheel={handleWheel}
    >
      <Timeline visibleItems={visibleItems} startDate={startDate} />
      <TimelineEvents schedules={schedules} visibleItems={visibleItems} startDate={startDate} />
    </Box>
  );
};
