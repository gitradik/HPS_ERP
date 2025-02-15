import moment from 'moment';
import { TimelineItem } from './TimelineItem';
import { Box, Typography, useTheme } from '@mui/material';

interface TimelineProps {
  visibleItems: number;
  startDate: moment.Moment;
}

export const Timeline = ({ visibleItems, startDate }: TimelineProps) => {
  const theme = useTheme();

  const generateTimeline = () => {
    const items = [];
    const months: string[] = [];
    const years = new Set<string>();

    for (let i = 0; i < visibleItems; i++) {
      const weekStart = startDate.clone().add(i, 'weeks').startOf('isoWeek');
      const isCurrent = weekStart.isSame(moment(), 'isoWeek');
      const month = weekStart.format('MMM');
      const year = weekStart.format('YYYY');

      const nextWeekStart = weekStart.clone().add(1, 'weeks');
      const isLast = nextWeekStart.month() !== weekStart.month();

      items.push(
        <TimelineItem
          key={`TimelineItem-${weekStart.format('GGGG-WW')}`}
          visibleItems={visibleItems}
          isCurrent={isCurrent}
          isLast={isLast}
        >
          {`KW ${weekStart.isoWeek()}`}
          {/* {weekStart.format('MMM')} */}
        </TimelineItem>,
      );

      if (!months.includes(month)) {
        months.push(month);
      }
      years.add(year);
    }

    return (
      <>
        <Box
          sx={{
            backgroundColor: theme.palette.primary.light,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            p: 1,
          }}
        >
          {[...years].map((year) => (
            <Typography color={theme.palette.primary.dark} fontWeight={600} key={year}>
              {year}
            </Typography>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
          }}
        >
          {months.map((month) => (
            <Typography key={month}>{month}</Typography>
          ))}
        </Box>
        <Box
          sx={{
            width: '100%',
            whiteSpace: 'nowrap',
          }}
        >
          {items}
        </Box>
      </>
    );
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: theme.palette.primary.light,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      {generateTimeline()}
    </Box>
  );
};
