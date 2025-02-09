import moment from 'moment';
import { TimelineItem } from './TimelineItem';

interface TimelineProps {
  visibleItems: number;
  startDate: moment.Moment;
  interval: string;
}

export const Timeline = ({ visibleItems, startDate, interval }: TimelineProps) => {
  const intervalToMomentUnit = {
    year: 'months',
    '6months': 'months',
    '3months': 'months',
    month: 'weeks',
    week: 'days',
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
        </TimelineItem>,
      );
    }

    return items;
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          width: '100%',
          whiteSpace: 'nowrap',
        }}
      >
        {generateTimeline()}
      </div>
    </div>
  );
};
