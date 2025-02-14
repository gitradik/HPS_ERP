import { Avatar, Box, Typography } from '@mui/material';
import { ColorVariation } from 'src/utils/constants/colorVariation';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';

interface TimelineEventProps {
  event: any;
}

export const TimelineEvent = ({ event }: TimelineEventProps) => {
  const avatarPath = getUploadsImagesProfilePath(event.schedule.staff.user.photo);

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
      }}
    >
      <Avatar src={avatarPath} alt="Personaleavatar" sx={{ width: 20, height: 20, mr: 1 }} />
      <Typography color="white" fontWeight={600}>
        {event.schedule.title}
      </Typography>
    </Box>
  );
};
