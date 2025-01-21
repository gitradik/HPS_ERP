import React from 'react';
import { Button, Box, Typography, CircularProgress, Stack } from '@mui/material';
import { useUpdateUserMutation } from 'src/services/api/user.api';
import { useDispatch } from 'react-redux';
import { refreshTokenFailure } from 'src/store/apps/auth/AuthSlice';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { registerType } from 'src/types/auth/auth';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

interface AuthSetPasswordProps extends registerType {
  userId: string;
}

const AuthSetPassword: React.FC<AuthSetPasswordProps> = ({ userId, title, subtitle, subtext }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateUser, { error: errorUpdateUser, isLoading }] = useUpdateUserMutation();
  const { enqueueSnackbar } = useSnackbar();

  // @ts-ignore
  const errorMessage = errorUpdateUser?.data?.friendlyMessage;

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(5, 'Das Passwort muss mindestens 5 Zeichen enthalten')
      .required('Passwort ist erforderlich'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Die Passwörter müssen übereinstimmen')
      .required('Passwortbestätigung ist erforderlich'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await updateUser({
        updateId: userId,
        input: { password: values.password },
      }).unwrap();

      dispatch(refreshTokenFailure(''));
      enqueueSnackbar('Passwort wurde erfolgreich geändert!', {
        variant: 'success',
        autoHideDuration: 2500,
      });
      enqueueSnackbar('Sie können sich jetzt mit Ihrer E-Mail und dem neuen Passwort anmelden.', {
        variant: 'info',
        autoHideDuration: 4000,
      });

      navigate('/');
    } catch (err) {
      // @ts-ignore
      enqueueSnackbar(err.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            {errorMessage && (
              <Typography color="error" variant="body2" mt={2} align="center">
                {errorMessage}
              </Typography>
            )}

            <Stack spacing={2}>
              <Box>
                <CustomFormLabel htmlFor="password">Passwort</CustomFormLabel>
                <Field
                  name="password"
                  as={CustomTextField}
                  id="password"
                  type="password"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Box>

              <Box>
                <CustomFormLabel htmlFor="confirmPassword">Passwort bestätigen</CustomFormLabel>
                <Field
                  name="confirmPassword"
                  as={CustomTextField}
                  id="confirmPassword"
                  type="password"
                  fullWidth
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Box>
            </Stack>

            <Box mt={4} display="flex" justifyContent="center">
              <Button
                type="submit"
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Speichern'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      {subtitle && (
        <Typography variant="body2" mt={2} align="center">
          {subtitle}
        </Typography>
      )}
    </>
  );
};

export default AuthSetPassword;
