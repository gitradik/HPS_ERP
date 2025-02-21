import { Box, Button, Grid2 as Grid, Stack, Tooltip } from '@mui/material';
import { IconSquareRoundedPlus, IconFilter } from '@tabler/icons-react';
import moment from 'moment';
import { useRef, useState } from 'react';
import { ClientsList } from 'src/components/dashboards/schedule/ClientsList';
import { Timeline } from 'src/components/dashboards/schedule/timeline/Timeline';
import { TimelineEvents } from 'src/components/dashboards/schedule/timeline/TimelineEvents';
import { useGetClientsQuery } from 'src/services/api/clientApi';
import { useGetSchedulesByClientIdsQuery } from 'src/services/api/scheduleApi';
import { ClientStatus } from 'src/types/client/client';
import { Schedule } from 'src/types/schedule/schedule';

const maxHeight = '57vh';
const getTimeLineEventsSx = {
  maxHeight,
  overflow: 'hidden',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
};

export const ScheduleTimeline = ({
  onEdit,
  onCreate,
}: {
  onEdit: (s: Schedule) => void;
  onCreate: () => void;
}) => {
  const { data: clientsData } = useGetClientsQuery({
    filters: { status: ClientStatus.ACTIVE },
  });
  const clients = clientsData?.items || [];
  const { data, isSuccess } = useGetSchedulesByClientIdsQuery(
    { clientIds: clients.map((item) => item.id) },
    { skip: !clientsData },
  );

  const groupedSchedules: [string, Map<string, Schedule[]>][] = [];

  if (data && isSuccess)
    clients.forEach((client) => {
      const staffSchedules = new Map<string, Schedule[]>();

      data.schedulesByClientIds.forEach((s: Schedule) => {
        if (s.client.id === client.id) {
          const staffId = s.staff.id;
          if (!staffSchedules.has(staffId)) staffSchedules.set(staffId, []);
          staffSchedules.get(staffId)?.push(s);
        }
      });

      groupedSchedules.push([client.id, staffSchedules]);
    });

  const [startDate, setStartDate] = useState(moment());
  const [visibleItems] = useState(12);
  const [groupBy] = useState(40); // for set 40px

  const clientsListRef = useRef<HTMLDivElement>(null);
  const timelineEventsRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (clientsListRef.current && timelineEventsRef.current)
      timelineEventsRef.current.scrollTop = clientsListRef.current.scrollTop;
  };

  const handleWheel = (e: any) => {
    const unit = 'week';
    setStartDate(
      e.deltaY < 0 ? startDate.clone().subtract(1, unit) : startDate.clone().add(1, unit),
    );
  };

  return (
    <Box
      mt={1}
      sx={{
        overflow: 'hidden',
        borderRadius: 0,
      }}
    >
      <Grid container spacing={2} columns={12}>
        <Grid direction="column" size={2}>
          <Box height="100%" maxHeight="116px">
            <Stack spacing={1} direction="row">
              <Tooltip title="Einsatz erstellen" placement="top">
                <Button
                  onClick={() => onCreate()}
                  sx={{ width: '100%', height: 48, borderRadius: 1, bgcolor: 'primary.light' }}
                >
                  <IconSquareRoundedPlus size="26" />
                </Button>
              </Tooltip>

              <Tooltip title="Filter" placement="top">
                <Button
                  sx={{ width: '100%', height: 48, borderRadius: 1, bgcolor: 'primary.light' }}
                >
                  <IconFilter size="26" />
                </Button>
              </Tooltip>
            </Stack>
          </Box>
          <Box
            ref={clientsListRef}
            onScroll={handleScroll}
            maxHeight={maxHeight}
            sx={{ overflowY: 'auto' }}
          >
            <ClientsList clients={clients} groupedSchedules={groupedSchedules} groupBy={groupBy} />
          </Box>
        </Grid>
        <Grid size={10} onWheel={handleWheel}>
          <Timeline visibleItems={visibleItems} startDate={startDate} />
          <Box borderRadius={0} ref={timelineEventsRef} sx={getTimeLineEventsSx}>
            <TimelineEvents
              onEdit={onEdit}
              groupedSchedules={groupedSchedules}
              visibleItems={visibleItems}
              startDate={startDate}
              groupBy={groupBy}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
