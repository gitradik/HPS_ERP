import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useDispatch } from 'src/store/Store';
import { useRegisterMutation } from 'src/services/api/auth.api';
import {
  registerFailure,
  registerSuccess,
  registerRequest,
} from 'src/store/apps/auth/RegisterSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { useSnackbar } from 'notistack';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtext?: string;
}

const CreateUserDialog = ({ open, onClose, title, subtext }: CreateUserDialogProps) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [register, { isLoading, error }] = useRegisterMutation();

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: 'admin',
    confirmPassword: 'admin',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {subtext && <Typography variant="body2" mb={2}>{subtext}</Typography>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            try {
              dispatch(registerRequest());
              await register({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
              }).unwrap();

              dispatch(registerSuccess());
              enqueueSnackbar('Benutzer registriert!', { variant: "success", autoHideDuration: 1500 });
              enqueueSnackbar('Jetzt Rolle zuweisen.', { variant: "info", autoHideDuration: 3000 })
              onClose();
            } catch (err: any) {
              dispatch(registerFailure(err));
              enqueueSnackbar(err?.data.friendlyMessage, { variant: "error", autoHideDuration: 3000 });
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Stack spacing={2}>
                {errorMessage && (
                  <Typography color="error" variant="body2">
                    {errorMessage}
                  </Typography>
                )}

                <Box>
                  <CustomFormLabel htmlFor="firstName">Vorname</CustomFormLabel>
                  <CustomTextField
                    id="firstName"
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    value={props.values.firstName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.touched.firstName && Boolean(props.errors.firstName)}
                    helperText={props.touched.firstName && props.errors.firstName}
                  />
                </Box>

                <Box>
                  <CustomFormLabel htmlFor="lastName">Nachname</CustomFormLabel>
                  <CustomTextField
                    id="lastName"
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    value={props.values.lastName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.touched.lastName && Boolean(props.errors.lastName)}
                    helperText={props.touched.lastName && props.errors.lastName}
                  />
                </Box>

                <Box>
                  <CustomFormLabel htmlFor="email">E-Mail</CustomFormLabel>
                  <CustomTextField
                    id="email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={props.values.email}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.touched.email && Boolean(props.errors.email)}
                    helperText={props.touched.email && props.errors.email}
                  />
                </Box>

                <Box sx={{
                  visibility: 'hidden',
                  overflow: 'hidden',
                  position: 'absolute'
                }}>
                <CustomTextField
                  
                  id="password"
                  name="password"
                  type="hidden"
                  value={props.values.password}
                  onChange={props.handleChange}
                />
                <CustomTextField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="hidden"
                  value={props.values.confirmPassword}
                  onChange={props.handleChange}
                />

                </Box>

              </Stack>

              <Box sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={props.isSubmitting || isLoading}
                >
                  {isLoading ? 'Wird registriert...' : 'Registrieren'}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;