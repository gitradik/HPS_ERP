import { Box, Button, Stack, Typography } from '@mui/material';

import ChildCard from 'src/components/shared/ChildCard';
import { IconMail, IconMapPin } from '@tabler/icons-react';
import { User } from 'src/types/auth/auth';
import { useNavigate } from 'react-router';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const IntroCard = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  return (
    <ChildCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography fontWeight={600} variant="h4">
          Einführung
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => navigate('/account-setting')}
        >
          Bearbeiten
        </Button>
      </Box>
      <Typography color="textSecondary" variant="subtitle2" mb={2}>
        Hallo, ich bin {user.firstName} {user.lastName}. Ich bin der {user.position || '...'}.
      </Typography>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconMail size="21" />
        <Typography variant="h6">{user.email || 'Email is not provided'}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        {/* @ts-ignore */}
        <WhatsAppIcon size="21" />
        <Typography variant="h6">{user.phoneNumber || 'Phone Number is not provided'}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={1}>
        <IconMapPin size="21" />
        <Typography variant="h6">{user.contactDetails || 'Address is not provided'}</Typography>
      </Stack>
    </ChildCard>
  );
};

export default IntroCard;
