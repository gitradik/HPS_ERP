// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Grid2 as Grid, Box, Typography } from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg?url';
import Logo from 'src/layouts/full/shared/logo/Logo';

import AuthTwoSteps from '../authForms/AuthTwoSteps';
import { ReactSVG } from 'react-svg';

const TwoSteps = () => (
  <PageContainer title="Zwei Schritte" description="Dies ist die Zwei-Schritte-Seite">
    <Grid container spacing={0} justifyContent="center" sx={{ overflowX: 'hidden' }}>
      <Grid
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
        size={{
          xs: 12,
          sm: 12,
          lg: 8,
          xl: 9
        }}>
        <Box position="relative">
          <Box px={3}>
            <Logo />
          </Box>
          <Box
            alignItems="center"
            justifyContent="center"
            height={'calc(100vh - 50px)'}
            sx={{
              display: {
                xs: 'none',
                lg: 'flex',
              },
            }}
          >
            <ReactSVG src={img1} style={{ width: '100%', maxWidth: '50%' }} />
          </Box>
        </Box>
      </Grid>
      <Grid
        display="flex"
        justifyContent="center"
        alignItems="center"
        size={{
          xs: 12,
          sm: 12,
          lg: 4,
          xl: 3
        }}>
        <Box p={4}>
          <Typography variant="h4" fontWeight="700">
            Zwei-Faktor-Authentifizierung
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" mt={2} mb={1}>
            Wir haben einen Bestätigungscode an Ihr Mobiltelefon gesendet. Geben Sie den Code aus dem Mobiltelefon in das untenstehende Feld ein.
          </Typography>
          <Typography variant="subtitle1" fontWeight="700" mb={1}>
            ******1234
          </Typography>
          <AuthTwoSteps />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default TwoSteps;
