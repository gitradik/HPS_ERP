import moment from 'moment';
import { TimelineEvent } from './TimelineEvent';
import { Box } from '@mui/material';

interface TimelineEventsProps {
  schedules: any[];
  visibleItems: number;
  startDate: moment.Moment;
  interval: string;
}

export const TimelineEvents = ({
  schedules,
  visibleItems,
  startDate,
  interval,
}: TimelineEventsProps) => {
  const intervalToMomentUnit = {
    year: 'months',
    '6months': 'months',
    '3months': 'months',
    month: 'weeks',
    week: 'days',
  };

  const generateEvents = () => {
    let events: any = [];
    // @ts-ignore
    const unit = intervalToMomentUnit[interval];

    schedules.forEach((s) => {
      const scheduleStart = moment(Number(s.start));
      const scheduleEnd = moment(Number(s.end)).endOf('day'); // Учитываем конец дня

      const visibleRangeStart = startDate.clone().startOf(unit);
      const visibleRangeEnd = startDate
        .clone()
        .add(visibleItems - 1, unit)
        .endOf(unit);
      const totalDaysInVisibleRange = visibleRangeEnd.diff(visibleRangeStart, 'days');

      if (scheduleStart.isBefore(visibleRangeEnd) && scheduleEnd.isAfter(visibleRangeStart)) {
        const startWithinRange = moment.max(scheduleStart, visibleRangeStart);
        const endWithinRange = moment.min(scheduleEnd, visibleRangeEnd);

        const startOffsetDays = startWithinRange.diff(visibleRangeStart, 'days', true);
        const durationDays = endWithinRange.diff(startWithinRange, 'days', true);

        const left = Math.max(0, (startOffsetDays / totalDaysInVisibleRange) * 100);
        const width = Math.min(100 - left, (durationDays / totalDaysInVisibleRange) * 100);

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
    <Box
      mt={1}
      sx={{
        position: 'relative',
        width: '100%',
      }}
    >
      {generateEvents()}
    </Box>
  );
};
