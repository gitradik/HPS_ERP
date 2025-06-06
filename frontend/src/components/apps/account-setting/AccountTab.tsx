// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect, useState } from 'react';
import { CardContent, Grid2 as Grid, Typography, Box, Button, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
// components
import BlankCard from '../../shared/BlankCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

// images
import Spinner from 'src/views/spinner/Spinner';
import {
  resetAccountSetting,
  selectAccountSetting,
  setContactDetails,
  setEmail,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setPosition,
  updateAccountSetting,
} from 'src/store/apps/setting/AccountSettingSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { useRolesAccess } from 'src/hooks/useRolesAccess';
import { userAccessRules } from './AccountTabData';
import { updateUserSuccess } from 'src/store/auth/AuthSlice';
import { isEmpty } from 'lodash';
import { useUpdateUserMutation } from 'src/services/api/userApi';
import { useSnackbar } from 'notistack';
import AvatarUploader from 'src/components/shared/AvatarUploader';
import { User } from 'src/types/user/user';

const AccountTab = ({ user }: { user: User }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const data = useSelector(selectAccountSetting);
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();
  const { hasAccess } = useRolesAccess(userAccessRules, user.role);

  // @ts-ignore
  const errorMessage = error?.data?.friendlyMessage;

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(5, 'Das Passwort muss mindestens 5 Zeichen lang sein')
      .required('Passwort ist erforderlich'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwörter müssen übereinstimmen')
      .required('Passwortbestätigung ist erforderlich'),
  });

  useEffect(() => {
    dispatch(updateAccountSetting(user));

    return () => {
      dispatch(resetAccountSetting());
    };
  }, [user]);

  const onSave = async () => {
    try {
      const result = await updateUser({ updateId: user.id, input: data }).unwrap();
      dispatch(updateUserSuccess(result.update));

      enqueueSnackbar('Benutzer erfolgreich aktualisiert!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };
  const onCancel = async () => {
    dispatch(updateAccountSetting(user));
  };
  const onSubmitPwdForm = async (values: any, actions: any) => {
    try {
      const result = await updateUser({
        updateId: user.id,
        input: { password: values.password },
      }).unwrap();
      dispatch(updateUserSuccess(result.update));

      enqueueSnackbar('Das Passwort wurde erfolgreich geändert!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      actions.resetForm();
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    } finally {
      actions.setSubmitting(false);
    }
  };

  if (!user || isEmpty(data)) {
    return <Spinner />;
  }

  return (
    <Grid container spacing={3}>
      {/* Change Profile */}
      <Grid size={{ xs: 12, lg: 6 }} sx={{ '.MuiPaper-root': { height: '100%' } }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Profil ändern
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Ändern Sie Ihr Profilbild hier
            </Typography>
            <Box textAlign="center" display="flex" justifyContent="center">
              <Box>
                <AvatarUploader user={user} />
              </Box>
            </Box>
          </CardContent>
        </BlankCard>
      </Grid>
      {/* Change Password */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Passwort ändern
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Bestätigen Sie hier Ihr Passwort, um es zu ändern
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmitPwdForm}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit}>
                  <Stack>
                    <Box>
                      <CustomFormLabel htmlFor="text-npwd">Neues Passwort</CustomFormLabel>
                      <CustomTextField
                        id="text-npwd"
                        variant="outlined"
                        name="password"
                        fullWidth
                        value={props.values.password}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={props.touched.password && Boolean(props.errors.password)}
                        helperText={props.touched.password && props.errors.password}
                        type="password"
                      />
                    </Box>

                    <Box>
                      <CustomFormLabel htmlFor="text-confirmPassword">
                        Bestätigen Sie das Passwort
                      </CustomFormLabel>
                      <CustomTextField
                        id="text-confirmPassword"
                        variant="outlined"
                        fullWidth
                        name="confirmPassword"
                        value={props.values.confirmPassword}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={
                          props.touched.confirmPassword && Boolean(props.errors.confirmPassword)
                        }
                        helperText={props.touched.confirmPassword && props.errors.confirmPassword}
                        type="password"
                      />
                    </Box>
                    <Box pt={3}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isLoading}
                        disabled={props.isSubmitting || isLoading}
                      >
                        Einreichen
                      </Button>
                    </Box>
                  </Stack>
                </form>
              )}
            </Formik>
          </CardContent>
        </BlankCard>
      </Grid>
      {/* Edit Details */}
      <Grid size={12}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Persönliche Angaben
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Um Ihre persönlichen Angaben zu ändern, bearbeiten und speichern Sie sie hier
            </Typography>
            <form>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="first-name">
                    Vorname
                  </CustomFormLabel>
                  <CustomTextField
                    id="first-name"
                    value={data.firstName}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('firstName')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setFirstName(e.target.value))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {/* 2 */}
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="last-name">
                    Nachname
                  </CustomFormLabel>
                  <CustomTextField
                    id="last-name"
                    value={data.lastName}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('lastName')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setLastName(e.target.value))
                    }
                  />
                </Grid>
                {/* email */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  {/* 5 */}
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-email">
                    E-Mail
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-email"
                    value={data.email}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('email')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setEmail(e.target.value))
                    }
                  />
                </Grid>
                {/* position */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  {/* 6 */}
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-position">
                    Position
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-position"
                    value={data.position || ''}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('position')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setPosition(e.target.value))
                    }
                  />
                </Grid>
                {/* phone */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  {/* 6 */}
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-phone">
                    Telefonnummer
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-phone"
                    value={data.phoneNumber || ''}
                    variant="outlined"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setPhoneNumber(e.target.value))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {/* 7 */}
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-address">
                    Adresse
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-address"
                    value={data.contactDetails || ''}
                    variant="outlined"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setContactDetails(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </BlankCard>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
          <Button
            loading={isLoading}
            disabled={isLoading}
            onClick={() => onSave()}
            size="large"
            variant="contained"
            color="primary"
          >
            Speichern
          </Button>
          <Button onClick={() => onCancel()} size="large" variant="text" color="error">
            Abbrechen
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AccountTab;
