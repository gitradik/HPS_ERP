import { styled, ToggleButton, ToggleButtonGroup } from '@mui/material';
import moment from 'moment';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useGetSchedulesByStaffIdsQuery } from 'src/services/api/scheduleApi';
import { useGetStaffsQuery } from 'src/services/api/staffApi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const ColorVariation = [
  { id: 1, eColor: '#1a97f5', value: 'default' },
  { id: 2, eColor: '#39b69a', value: 'green' },
  { id: 3, eColor: '#fc4b6c', value: 'red' },
  { id: 4, eColor: '#615dff', value: 'azure' },
  { id: 5, eColor: '#fdd43f', value: 'warning' },
];

const TimelineItem = styled('div')<{ visibleItems: number; isCurrent: boolean }>`
  display: inline-block;
  width: ${(props) => 100 / props.visibleItems}%;
  padding: 10px;
  border-right: 1px solid #ccc;
  text-align: center;
  background-color: ${(props) => (props.isCurrent ? '#ffeb3b' : 'transparent')};
  font-weight: ${(props) => (props.isCurrent ? 'bold' : 'normal')};

  &:last-child {
    border-right: none;
  }
`;

const SchedulePage = () => {
  const { t } = useTranslation();
  const BCrumb = [{ to: '/', title: t('MenuItems.home_page') }, { title: t('MenuItems.schedule') }];
  const { data: staffsData } = useGetStaffsQuery({ filters: { isAssigned: true } });
  const { data } = useGetSchedulesByStaffIdsQuery(
    { staffIds: staffsData?.items.map((item) => item.id) || [] },
    { skip: !staffsData },
  );

  const schedules = data?.schedulesByStaffIds || [];

  const [interval, setInterval] = useState('year');
  const [startDate, setStartDate] = useState(moment());
  const [visibleItems, setVisibleItems] = useState(12);
  const intervalToMomentUnit = {
    year: 'months',
    '6months': 'months',
    '3months': 'months',
    month: 'weeks',
    week: 'days',
  };

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

  const generateTimeline = () => {
    let items = [];
    // @ts-ignore
    const unit = intervalToMomentUnit[interval];

    for (let i = 0; i < visibleItems; i++) {
      const date = startDate.clone().add(i, unit);
      const isCurrent = date.isSame(moment(), unit);

      items.push(
        <TimelineItem
          key={date.format('YYYY-MM-DD')}
          visibleItems={visibleItems}
          isCurrent={isCurrent}
        >
          {['week', 'month'].includes(interval)
            ? date.format('DD MMM YYYY')
            : date.format('MMM YYYY')}
        </TimelineItem>
      );
    }

    return items;
  };

  const generateEvents = () => {
    let events: any = [];
    // @ts-ignore
    const unit = intervalToMomentUnit[interval];
    
    schedules.forEach(s => {
      const scheduleStart = moment(Number(s.start));  // Используем оригинальные значения
      const scheduleEnd = moment(Number(s.end));      // Используем оригинальные значения
  
      const eventItems: any[] = [];
      for (let i = 0; i < visibleItems; i++) {
        if (eventItems.find((eItem) => eItem.id === s.id)) continue;
  
        const date = startDate.clone().add(i, unit);
        if (
          scheduleStart.isSameOrBefore(date.clone().endOf(unit)) &&
          scheduleEnd.isSameOrAfter(startDate)
        ) {
          const visibleRangeStart = startDate.clone().startOf(unit); // Начало текущего диапазона шкалы
          const visibleRangeEnd = startDate.clone().add(visibleItems - 1, unit).endOf(unit); // Конец диапазона
  
          const startWithinRange = moment.max(scheduleStart, visibleRangeStart);
          const endWithinRange = moment.min(scheduleEnd, visibleRangeEnd);
          const durationWithinRange = endWithinRange.diff(startWithinRange, 'days');
  
          const totalDaysInVisibleRange = visibleRangeEnd.diff(visibleRangeStart, 'days'); // Всего дней в видимом диапазоне
          const left = (startWithinRange.diff(visibleRangeStart, 'days') / totalDaysInVisibleRange) * 100;
          const width = (durationWithinRange / totalDaysInVisibleRange) * 100;
  
          eventItems.push({
            id: s.id,
            key: s.id + i,
            left: `${left}%`,
            width: `${width}%`,
            schedule: s,
          });
        }
      }
  
      events.push(
        ...eventItems.map((eItem) => (
          <div
            key={eItem.key}
            style={{
              position: 'relative', // Обновление позиции события на временной шкале
              left: eItem.left,
              width: eItem.width,
              backgroundColor:
                ColorVariation.find((cv) => cv.value === eItem.schedule.color)?.eColor || 'black',
              whiteSpace: 'nowrap',
              color: 'white',
              padding: '5px',
            }}
          >
            {s.title} ID: {s.staff.id}
          </div>
        )),
      );
    });
  
    return events;
  };
  
  
  

  const handleWheel = (e: any) => {
    // @ts-ignore
    const unit = intervalToMomentUnit[interval];

    const newStartDate = e.deltaY < 0 
      ? startDate.clone().subtract(1, unit)
      : startDate.clone().add(1, unit);

    setStartDate(newStartDate);
  };

  return (
    <PageContainer title={t('MenuItems.schedule')} description={t('MenuItems.schedule_descr')}>
      <Breadcrumb title={t('MenuItems.schedule')} items={BCrumb} />
      <ToggleButtonGroup value={interval} exclusive onChange={handleIntervalChange}>
        <ToggleButton value="year">12 месяцев</ToggleButton>
        <ToggleButton value="6months">6 месяцев</ToggleButton>
        <ToggleButton value="3months">3 месяца</ToggleButton>
        <ToggleButton value="month">1 месяц</ToggleButton>
        <ToggleButton value="week">1 неделя</ToggleButton>
      </ToggleButtonGroup>
      <div
        style={{
          marginTop: 4,
          overflowX: 'hidden',
          height: '310px',
          position: 'relative',
          borderBottom: '1px solid black',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: 'white',
          }}
        >
          <div
            onWheel={handleWheel}
            style={{
              position: 'relative',
              width: '100%',
              whiteSpace: 'nowrap',
            }}
          >
            {generateTimeline()}
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            marginTop: 4,
            width: '100%',
          }}
        >
          {generateEvents()}
        </div>
      </div>
    </PageContainer>
  );
};

export default SchedulePage;
