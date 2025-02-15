import { Box, Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { ClientsList } from 'src/components/dashboards/schedule/ClientsList';
import { Timeline } from 'src/components/dashboards/schedule/timeline/Timeline';
import { TimelineEvents } from 'src/components/dashboards/schedule/timeline/TimelineEvents';
import { useGetClientsQuery } from 'src/services/api/clientApi';
import { useGetSchedulesByClientIdsQuery } from 'src/services/api/scheduleApi';
import { ClientStatus } from 'src/types/client/client';
import { SortOrder } from 'src/types/query';
import { Schedule } from 'src/types/schedule/schedule';

export const ScheduleTimeline = () => {
  const { data: clientsData } = useGetClientsQuery({
    filters: { status: ClientStatus.ACTIVE },
    sortOptions: [['id', SortOrder.ASC]],
  });
  const clients = clientsData?.items || [];
  const { data } = useGetSchedulesByClientIdsQuery(
    { clientIds: clients.map((item) => item.id) },
    { skip: !clientsData },
  );
  const groupedSchedules = (data?.schedulesByClientIds || []).reduce(
    (acc, schedule) => {
      const clientId = schedule.client.id;
      const staffId = schedule.staff.id;

      if (!acc[clientId]) acc[clientId] = {};
      if (!acc[clientId][staffId]) acc[clientId][staffId] = [];

      acc[clientId][staffId].push(schedule);

      return acc;
    },
    {} as Record<string, Record<string, Schedule[]>>,
  );

  const [startDate, setStartDate] = useState(moment());
  const [visibleItems] = useState(12);
  const groupBy = 40; // for set 40px

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
    >
      <Grid container spacing={2} columns={12}>
        <Grid size={2} pt="116px">
          <ClientsList clients={clients} groupedSchedules={groupedSchedules} groupBy={groupBy} />
        </Grid>
        <Grid size={10} onWheel={handleWheel}>
          <Timeline visibleItems={visibleItems} startDate={startDate} />
          <TimelineEvents
            groupedSchedules={groupedSchedules}
            visibleItems={visibleItems}
            startDate={startDate}
            groupBy={groupBy}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
