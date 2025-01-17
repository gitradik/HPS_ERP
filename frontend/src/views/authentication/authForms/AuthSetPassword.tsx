import React from 'react';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useUpdateUserMutation } from 'src/services/api/user.api';
import { useDispatch } from 'react-redux';
import { refreshTokenFailure } from 'src/store/apps/auth/AuthSlice';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

interface AuthSetPasswordProps {
  userId: string;
}

const AuthSetPassword: React.FC<AuthSetPasswordProps> = ({ userId }) => {
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
    password: Yup.string().min(4, 'Das Passwort muss mindestens 4 Zeichen enthalten').required('Passwort ist erforderlich'),
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

      dispatch(refreshTokenFailure(""));
      enqueueSnackbar('Passwort wurde erfolgreich geändert!', { variant: "success", autoHideDuration: 2500 });
      enqueueSnackbar('Sie können sich jetzt mit Ihrer E-Mail und dem neuen Passwort anmelden.', { variant: "info", autoHideDuration: 4000 });

      navigate('/');
    } catch (err) {
      // @ts-ignore
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: "error", autoHideDuration: 3000 });
    }
  };

  return (
    <Box maxWidth="400px" mx="auto" p={2} boxShadow={3}>
      <Typography variant="h5" mb={2} align="center">
        Neues Passwort festlegen
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Field
              name="password"
              as={TextField}
              label="Neues Passwort"
              type="password"
              fullWidth
              margin="normal"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              required
            />
            <Field
              name="confirmPassword"
              as={TextField}
              label="Passwort bestätigen"
              type="password"
              fullWidth
              margin="normal"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              required
            />
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Speichern'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AuthSetPassword;
