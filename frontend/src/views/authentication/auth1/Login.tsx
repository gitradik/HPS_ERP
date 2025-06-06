// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Link } from 'react-router';
import { Grid2 as Grid, Box, Stack, Typography } from '@mui/material';
import { ReactSVG } from 'react-svg';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg?url';
import AuthLogin from '../authForms/AuthLogin';
import AuthLogo from 'src/layouts/full/shared/logo/AuthLogo';

const Login = () => (
  <PageContainer title="Anmeldung" description="Dies ist die Anmeldeseite">
    <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
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
          <AuthLogin
            title="Herzlich Willkommen bei HPS ERP"
            subtext={
              <Typography variant="subtitle1" color="textSecondary" mb={1}>
                Ihr persönlicher Login-Bereich
              </Typography>
            }
            subtitle={
              <Stack direction="row" justifyContent={'center'} spacing={1} mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="500">
                  Neu bei HPS ERP?
                </Typography>
                <Typography
                  component={Link}
                  to="/auth/register"
                  fontWeight="500"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Konto erstellen
                </Typography>
              </Stack>
            }
          />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Login;
