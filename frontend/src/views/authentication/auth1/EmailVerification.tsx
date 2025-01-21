import { useEffect } from 'react';
import { Grid2 as Grid, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  emailVerifyFailure,
  emailVerifyRequest,
  emailVerifySuccess,
  selectUserId,
} from 'src/store/apps/auth/AuthSlice';
import AuthSetPassword from 'src/views/authentication/authForms/AuthSetPassword';
import img1 from 'src/assets/images/backgrounds/login-bg.svg?url';
import { useVerifyEmailMutation } from 'src/services/api/auth.api';
import Spinner from 'src/views/spinner/Spinner';
import { useSnackbar } from 'notistack';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import { ReactSVG } from 'react-svg';

const EmailVerification = () => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const dispatch = useDispatch();
  const [verifyEmail, { isLoading, isSuccess, error }] = useVerifyEmailMutation();
  const userId = useSelector(selectUserId);
  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

  useEffect(() => {
    if (token) {
      dispatch(emailVerifyRequest());
      verifyEmail({ token })
        .unwrap()
        .then((result) => {
          // @ts-ignore
          const { verifyEmail } = result;
          dispatch(emailVerifySuccess(verifyEmail));
          enqueueSnackbar(verifyEmail.message, { variant: 'success', autoHideDuration: 3000 });
        })
        .catch((err) => {
          dispatch(emailVerifyFailure(err?.data?.friendlyMessage));
          enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
        });
    }
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner />
      </Box>
    );
  }

  return (
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
            lg: 5,
            xl: 4,
          }}
        >
          <Box p={4}>
            {isSuccess && userId && (
              <AuthSetPassword
                userId={userId}
                title="Herzlich Willkommen bei HPS ERP"
                subtext="E-Mail erfolgreich verifiziert. Bitte legen Sie nun Ihr Passwort fest."
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default EmailVerification;
