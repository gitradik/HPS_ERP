import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { ColorVariation } from 'src/utils/constants/colorVariation';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';

interface TimelineEventProps {
  event: any;
  isBeforeStart: boolean;
  onClickTitle: () => void;
}

export const TimelineEvent = ({ event, isBeforeStart, onClickTitle }: TimelineEventProps) => {
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
      <Tooltip title={`${event.schedule.title} bearbeiten`}>
        <Typography
          component="span"
          color="white"
          onClick={() => onClickTitle()}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          fontWeight={500}
        >
          {event.schedule.title}
        </Typography>
      </Tooltip>
    </Box>
  );
};
