import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { Client } from 'src/types/client/client';
import { Schedule } from 'src/types/schedule/schedule';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';

interface ClientsListProps {
  clients: Client[];
  groupedSchedules: [string, Map<string, Schedule[]>][];
  groupBy: number;
}

export const ClientsList = ({ clients, groupedSchedules, groupBy }: ClientsListProps) => {
  const theme = useTheme();

  if (groupedSchedules.length === 0) return null;

  return (
    <Box pt={1}>
      {clients.map((c, idx) => {
        const schedules = groupedSchedules.find(([clientId]) => clientId === c.id)?.[1];
        if (!schedules) return null;

        const avatarPath = getUploadsImagesProfilePath(c.user.photo);

        return (
          <Box
            key={`TimeLineClient-${c.id}${idx}`}
            sx={{
              backgroundColor: theme.palette.primary.light,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            {Array.from(schedules.entries()).map(([staffId], idx) => (
              <Box
                key={`TimeLineClientLine-${c.id}-${staffId}`}
                height={`${groupBy}px`}
                pl={1}
                mb={1}
              >
                {idx === 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Avatar
                      src={avatarPath}
                      alt="Kundenavatar"
                      sx={{ width: 20, height: 20, mr: 1 }}
                    />
                    <Typography>{c.user.firstName + ' ' + c.user.lastName}</Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};
