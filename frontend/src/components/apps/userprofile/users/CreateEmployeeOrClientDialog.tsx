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
  import { useCreateEmployeeMutation } from 'src/services/api/employee.api';
  import { User, UserRole } from 'src/types/auth/auth'; // Импортируем ваш enum
import { registerFailure, registerRequest, registerSuccess } from 'src/store/apps/auth/RegisterSlice';
import { useSnackbar } from 'notistack';
  
  interface CreateEmployeeOrClientDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtext?: string;
    user: User;
  }
  
  const CreateEmployeeOrClientDialog = ({
    open,
    onClose,
    title,
    subtext,
    user
  }: CreateEmployeeOrClientDialogProps) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [createEmployee, { isLoading: isEmployeeLoading }] = useCreateEmployeeMutation();
  
    const initialValues = {
      role: '', // Без значения по умолчанию
    };
  
    const validationSchema = Yup.object({
      role: Yup.string()
        .oneOf(Object.values(UserRole), 'Invalid role') // Используем значения из UserRole
        .required('Role is required'),
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
                if (values.role === UserRole.EMPLOYEE) {
                  await createEmployee({
                    userId: Number(user.id), 
                  }).unwrap();
                } else {
                    console.log("emitation Client create request")
                }
                
                dispatch(registerSuccess());
                enqueueSnackbar(values.role === UserRole.EMPLOYEE
                  ? 'Mitarbeiter erfolgreich erstellt!'
                  : 'Kunde erfolgreich registriert!', { variant: "success", autoHideDuration: 3000 });
                onClose();
              } catch (err: any) {
                dispatch(registerFailure(err));
                enqueueSnackbar(err?.data?.friendlyMessage, { variant: "error", autoHideDuration: 3000 });
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
                      </Select>
                    </FormControl>
                    {props.touched.role && props.errors.role && (
                      <Typography color="error" variant="body2">
                        {props.errors.role}
                      </Typography>
                    )}
                  </Box>
  
                </Stack>
  
                <Box sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={props.isSubmitting || isEmployeeLoading}
                  >
                    {isEmployeeLoading ? 'Wird verarbeitet...' : 'Absenden'}
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
  
  export default CreateEmployeeOrClientDialog;
  