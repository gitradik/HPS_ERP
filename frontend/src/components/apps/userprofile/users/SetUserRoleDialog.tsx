import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useDispatch } from 'src/store/Store';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCreateEmployeeMutation } from 'src/services/api/employeeApi';
import { User, UserRole } from 'src/types/user/user'; // Импортируем ваш enum
import { registerFailure, registerRequest, registerSuccess } from 'src/store/auth/RegisterSlice';
import { useSnackbar } from 'notistack';
import { useCreateClientMutation } from 'src/services/api/clientApi';
import { useCreateStaffMutation } from 'src/services/api/staffApi';

interface CreateEmployeeOrClientDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtext?: string;
  user: User;
}

const SetUserRoleDialog = ({
  open,
  onClose,
  title,
  subtext,
  user,
}: CreateEmployeeOrClientDialogProps) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createEmployee, { isLoading: isEmployeeLoading }] = useCreateEmployeeMutation();
  const [createClient, { isLoading: isClientLoading }] = useCreateClientMutation();
  const [createStaff, { isLoading: isStaffLoading }] = useCreateStaffMutation();

  const initialValues = {
    role: '',
  };

  const validationSchema = Yup.object({
    role: Yup.string()
      .oneOf(Object.values(UserRole), 'Ungültige Rolle')
      .required('Rolle ist erforderlich'),
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {subtext && (
          <Typography variant="body2" mb={2}>
            {subtext}
          </Typography>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            try {
              dispatch(registerRequest());

              const userId = Number(user.id);

              if (values.role === UserRole.EMPLOYEE) {
                await createEmployee({ userId }).unwrap();
              } else if (values.role === UserRole.STAFF) {
                await createStaff({ userId }).unwrap();
              } else {
                await createClient({ userId }).unwrap();
              }

              dispatch(registerSuccess());
              enqueueSnackbar(
                values.role === UserRole.EMPLOYEE
                  ? 'Mitarbeiter erfolgreich erstellt!'
                  : 'Kunde erfolgreich registriert!',
                { variant: 'success', autoHideDuration: 3000 },
              );
              onClose();
            } catch (err: any) {
              dispatch(registerFailure(err));
              enqueueSnackbar(err?.data?.friendlyMessage, {
                variant: 'error',
                autoHideDuration: 3000,
              });
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Stack mt={3}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>Rolle</InputLabel>
                    <Select
                      label="Role"
                      id="role"
                      name="role"
                      value={props.values.role}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={props.touched.role && Boolean(props.errors.role)}
                    >
                      <MenuItem value={UserRole.EMPLOYEE}>Mitarbeiter</MenuItem>
                      <MenuItem value={UserRole.CLIENT}>Kunden</MenuItem>
                      <MenuItem value={UserRole.STAFF}>Personale</MenuItem>
                    </Select>
                  </FormControl>
                  {props.touched.role && props.errors.role && (
                    <Typography color="error" variant="body2">
                      {props.errors.role}
                    </Typography>
                  )}
                </Box>
              </Stack>

              <DialogActions sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    props.isSubmitting || isEmployeeLoading || isClientLoading || isStaffLoading
                  }
                >
                  {isEmployeeLoading || isClientLoading || isStaffLoading
                    ? 'Wird verarbeitet...'
                    : 'Absenden'}
                </Button>
                <Button onClick={onClose} color="error">
                  Abbrechen
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default SetUserRoleDialog;
