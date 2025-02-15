import { Avatar, Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { ColorVariation } from 'src/utils/constants/colorVariation';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';

interface TimelineEventProps {
  event: any;
  isBeforeStart: boolean;
}

export const TimelineEvent = ({ event, isBeforeStart }: TimelineEventProps) => {
  const avatarPath = getUploadsImagesProfilePath(event.schedule.staff.user.photo);
  const leftRadius = useMemo(() => (isBeforeStart ? 0 : undefined), [isBeforeStart]);

  return (
    <Box
      sx={{
        position: 'absolute',
        left: event.left,
        width: event.width,
        backgroundColor:
          ColorVariation.find((cv) => cv.value === event.schedule.color)?.eColor || 'black',
        whiteSpace: 'nowrap',
        display: 'flex',
        p: 1,
        height: '100%',
        borderTopLeftRadius: leftRadius,
        borderBottomLeftRadius: leftRadius,
      }}
    >
      <Avatar src={avatarPath} alt="Personaleavatar" sx={{ width: 20, height: 20, mr: 1 }} />
      <Typography color="white" fontWeight={600}>
        {event.schedule.title}
      </Typography>
    </Box>
  );
};
