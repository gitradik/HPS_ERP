import { ColorVariation } from 'src/utils/constants/colorVariation';

interface TimelineEventProps {
  event: any;
}

export const TimelineEvent = ({ event }: TimelineEventProps) => {
  return (
    <div
      style={{
        position: 'relative',
        left: event.left,
        width: event.width,
        backgroundColor:
          ColorVariation.find((cv) => cv.value === event.schedule.color)?.eColor || 'black',
        whiteSpace: 'nowrap',
        color: 'white',
        padding: '5px',
      }}
    >
      {event.schedule.title} ID: {event.schedule.staff.id}
    </div>
  );
};
