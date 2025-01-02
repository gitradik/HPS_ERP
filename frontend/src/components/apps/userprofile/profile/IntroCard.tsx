// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Stack, Typography } from '@mui/material';

import ChildCard from 'src/components/shared/ChildCard';
import { IconBriefcase, IconDeviceDesktop, IconMail, IconMapPin } from '@tabler/icons-react';

const IntroCard = () => (
  <ChildCard>
    <Typography fontWeight={600} variant="h4" mb={2}>
      Introduction
    </Typography>
    <Typography color="textSecondary" variant="subtitle2" mb={2}>
      Hello, I am Hermann Baun. I am the Geschäftsführung (CEO/Managing Director). 
    </Typography>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconBriefcase size="21" />
      <Typography variant="h6">Sir, HPS ERP Project</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconMail size="21" />
      <Typography variant="h6">info@info.com</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconDeviceDesktop size="21" />
      <Typography variant="h6">www.hps-erp.com</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={1}>
      <IconMapPin size="21" />
      <Typography variant="h6">Berlin, Deutschland - 10115</Typography>
    </Stack>
  </ChildCard>
);

export default IntroCard;
