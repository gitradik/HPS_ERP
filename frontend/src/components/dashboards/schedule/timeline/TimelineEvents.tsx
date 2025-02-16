import moment from 'moment';
import { TimelineEvent } from './TimelineEvent';
import { Box } from '@mui/material';
import { Schedule } from 'src/types/schedule/schedule';

interface TimelineEventsProps {
  groupedSchedules: [string, Map<string, Schedule[]>][];
  visibleItems: number;
  startDate: moment.Moment;
  groupBy: number;
}

export const TimelineEvents = ({
  groupedSchedules,
  visibleItems,
  startDate,
  groupBy,
}: TimelineEventsProps) => {
  const generateEvents = (schedules: Schedule[]) => {
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
              isBeforeStart={scheduleStart.isBefore(visibleRangeStart)}
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
    <Box pt={1}>
      {groupedSchedules.map(([clientId, staffData]) =>
        Array.from(staffData.entries()).map(([staffId, schedules]) => (
          <Box
            key={`${clientId}-${staffId}`}
            sx={{
              position: 'relative',
              height: `${groupBy}px`,
              mb: 1,
            }}
          >
            {generateEvents(schedules)}
          </Box>
        )),
      )}
    </Box>
  );
};
