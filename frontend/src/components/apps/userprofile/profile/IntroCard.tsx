// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { IconButton, Stack, Typography } from '@mui/material';

import ChildCard from 'src/components/shared/ChildCard';
import { IconBriefcase, IconDeviceDesktop, IconMail, IconMapPin } from '@tabler/icons-react';
import { User } from 'src/types/auth/auth';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router';

const IntroCard = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  return (
    <ChildCard>
        {/* Кнопка редактировать */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
          }}
          size="small"
          color="primary"
          onClick={() => navigate("/account-setting")}
        >
          <Edit />
        </IconButton>
        
      <Typography fontWeight={600} variant="h4" mb={2}>
        Introduction
      </Typography>
      <Typography color="textSecondary" variant="subtitle2" mb={2}>
        Hello, I am {user.firstName} {user.lastName}. I am the {user.position || 'Member'}.
      </Typography>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconBriefcase size="21" />
        <Typography variant="h6">{user.role || 'User Role Not Available'}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconMail size="21" />
        <Typography variant="h6">{user.email || 'Email Not Provided'}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={1}>
        <IconMapPin size="21" />
        <Typography variant="h6">
          {user.contactDetails || 'Address Not Provided'}
        </Typography>
      </Stack>
    </ChildCard>
  );
};

export default IntroCard;
