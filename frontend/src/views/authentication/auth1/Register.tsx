// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Link } from 'react-router';
import { Grid2 as Grid, Box, Typography, Stack } from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg?url';

import AuthRegister from '../authForms/AuthRegister';
import { ReactSVG } from 'react-svg';
import AuthLogo from 'src/layouts/full/shared/logo/AuthLogo';

const Register = () => (
  <PageContainer title="Registrierung" description="Dies ist die Registrierungsseite">
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
          lg: 7,
          xl: 8,
        }}
      >
        <Box position="relative">
          <Box px={3}>
            <AuthLogo />
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
          lg: 5,
          xl: 4,
        }}
      >
        <Box p={4}>
          <AuthRegister
            title="Herzlich Willkommen bei HPS ERP"
            subtext={
              <Typography variant="subtitle1" color="textSecondary" mb={1}>
                Ihr persönlicher Registrierungsbereich
              </Typography>
            }
            subtitle={
              <Stack direction="row" spacing={1} mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  Haben Sie schon ein Account?
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/login"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Login Bereich
                </Typography>
              </Stack>
            }
          />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Register;
