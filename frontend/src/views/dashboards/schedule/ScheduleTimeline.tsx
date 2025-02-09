import moment from 'moment';
import { useState } from 'react';
import { IntervalSelector } from 'src/components/dashboards/schedule/timeline/IntervalSelector';
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

  const [interval, setInterval] = useState('year');
  const [startDate, setStartDate] = useState(moment());
  const [visibleItems, setVisibleItems] = useState(12);

  const handleIntervalChange = (_: any, newInterval: any) => {
    if (newInterval) {
      setInterval(newInterval);
      switch (newInterval) {
        case 'year':
          setVisibleItems(12);
          break;
        case '6months':
          setVisibleItems(6);
          break;
        case '3months':
          setVisibleItems(3);
          break;
        case 'month':
          setVisibleItems(4);
          break;
        case 'week':
          setVisibleItems(7);
          break;
        default:
          setVisibleItems(12);
      }
    }
  };

  const handleWheel = (e: any) => {
    const intervalToMomentUnit = {
      year: 'months',
      '6months': 'months',
      '3months': 'months',
      month: 'weeks',
      week: 'days',
    };
    // @ts-ignore
    const unit = intervalToMomentUnit[interval];

    const newStartDate =
      e.deltaY < 0 ? startDate.clone().subtract(1, unit) : startDate.clone().add(1, unit);

    setStartDate(newStartDate);
  };

  return (
    <div
      style={{
        marginTop: 4,
        overflowX: 'hidden',
        height: '400px',
        position: 'relative',
        borderBottom: '1px solid black',
      }}
      onWheel={handleWheel}
    >
      <IntervalSelector interval={interval} handleIntervalChange={handleIntervalChange} />
      <Timeline visibleItems={visibleItems} startDate={startDate} interval={interval} />
      <TimelineEvents
        schedules={schedules}
        visibleItems={visibleItems}
        startDate={startDate}
        interval={interval}
      />
    </div>
  );
};
