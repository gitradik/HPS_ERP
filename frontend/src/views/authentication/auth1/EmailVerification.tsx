import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { emailVerifyFailure, emailVerifyRequest, emailVerifySuccess, selectUserId } from 'src/store/apps/auth/AuthSlice';
import AuthSetPassword from 'src/views/authentication/authForms/AuthSetPassword';
import { useVerifyEmailMutation } from 'src/services/api/auth.api';
import Spinner from 'src/views/spinner/Spinner';
import { useSnackbar } from 'notistack';

const EmailVerification = () => {
    const location = useLocation();
      const { enqueueSnackbar } = useSnackbar();
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
          enqueueSnackbar(verifyEmail.message, { variant: "success", autoHideDuration: 3000 });
        })
        .catch((err) => {
          dispatch(emailVerifyFailure(err?.data?.friendlyMessage));
          enqueueSnackbar(err?.data?.friendlyMessage, { variant: "error", autoHideDuration: 3000 });
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
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        {isSuccess && userId && <AuthSetPassword userId={userId} />}
    </Box>
  );
};

export default EmailVerification;

