import moment from 'moment';
import { TimelineEvent } from './TimelineEvent';
import { Box } from '@mui/material';

interface TimelineEventsProps {
  schedules: any[];
  visibleItems: number;
  startDate: moment.Moment;
}

export const TimelineEvents = ({ schedules, visibleItems, startDate }: TimelineEventsProps) => {
  const groupedSchedules = schedules.reduce(
    (acc, schedule) => {
      const { id } = schedule.staff;
      if (!acc[id]) acc[id] = [];
      acc[id].push(schedule);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const generateEvents = (schedules: any[]) => {
    const events: any[] = [];
    const visibleRangeStart = startDate.clone().startOf('isoWeek');
    const visibleRangeEnd = startDate.clone().add(visibleItems, 'weeks').endOf('isoWeek');
    const totalWeeksInVisibleRange = visibleRangeEnd.diff(visibleRangeStart, 'weeks');

    schedules.forEach((s) => {
      const scheduleStart = moment(Number(s.start)).startOf('isoWeek');
      const scheduleEnd = moment(Number(s.end)).endOf('isoWeek');

      if (scheduleStart.isBefore(visibleRangeEnd) && scheduleEnd.isAfter(visibleRangeStart)) {
        const startWithinRange = moment.max(scheduleStart, visibleRangeStart).startOf('isoWeek');
        const endWithinRange = moment
          .min(scheduleEnd, visibleRangeEnd)
          .endOf('isoWeek')
          .add(1, 'week');

        const startOffsetWeeks = startWithinRange.diff(visibleRangeStart, 'weeks');
        const durationWeeks = endWithinRange.diff(startWithinRange, 'weeks');

        const left = (startOffsetWeeks / totalWeeksInVisibleRange) * 100;
        const width = (durationWeeks / totalWeeksInVisibleRange) * 100;

        if (width > 0) {
          events.push(
            <TimelineEvent
              key={s.id}
              event={{
                id: s.id,
                left: `${left}%`,
                width: `${width}%`,
                schedule: s,
              }}
            />,
          );
        }
      }
    });

    return events;
  };

  return (
    <Box pt={1} sx={{ width: '100%' }}>
      {Object.entries(groupedSchedules).map(([staffId, staffSchedules]: [string, any]) => (
        <Box
          key={staffId}
          sx={{
            position: 'relative',
            width: '100%',
            height: '40px',
            mb: 1,
          }}
        >
          {generateEvents(staffSchedules)}
        </Box>
      ))}
    </Box>
  );
};
