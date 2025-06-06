// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect, useState, useMemo } from 'react';
import { CardContent, Grid2 as Grid, Typography, Box, Button, Stack, Divider } from '@mui/material';
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
  updateAccountSetting,
} from 'src/store/apps/setting/AccountSettingSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { useRolesAccess } from 'src/hooks/useRolesAccess';
import { selectUserRole } from 'src/store/auth/AuthSlice';
import { isEmpty } from 'lodash';
import { useUpdateUserMutation } from 'src/services/api/userApi';
import { useSnackbar } from 'notistack';
import { userAccessRules } from '../../apps/account-setting/AccountTabData';
import { Client, ClientStatus } from 'src/types/client/client';
import {
  resetClientSetting,
  selectClientSetting,
  setClientCompanyName,
  setClientStatus,
  updateClientSetting,
} from 'src/store/apps/setting/ClientSettingSlice';
import { useUpdateClientMutation } from 'src/services/api/clientApi';
import { UserRole } from 'src/types/user/user';
import AvatarUploaderById from 'src/components/shared/AvatarUploaderById';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';

const ClientSetting = ({ client }: { client: Client }) => {
  const { user, companyName, status } = client;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const data = useSelector(selectAccountSetting);
  // @ts-ignore
  const clientData = useSelector(selectClientSetting);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [updateClient, { isLoading: isLoadingClient }] = useUpdateClientMutation();
  const userRole = useSelector(selectUserRole);
  const { hasAccess } = useRolesAccess(
    {
      ...userAccessRules,
      companyName: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      status: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    userRole,
  );

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
    dispatch(updateClientSetting({ companyName, status }));

    return () => {
      dispatch(resetAccountSetting());
      dispatch(resetClientSetting());
    };
  }, [user, companyName, status]);

  const onSave = async () => {
    try {
      await updateUser({ updateId: user.id, input: data }).unwrap();
      await updateClient({ updateId: client.id, input: clientData }).unwrap();
      enqueueSnackbar('Kundendaten erfolgreich aktualisiert!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };
  const onCancel = async () => {
    dispatch(updateAccountSetting(user));
    dispatch(updateClientSetting({ companyName, status }));
  };
  const onSubmitPwdForm = async (values: any, actions: any) => {
    try {
      await updateUser({
        updateId: user.id,
        input: { password: values.password },
      }).unwrap();

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

  if (!user || isEmpty(data) || isEmpty(clientData)) {
    return <Spinner />;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }} sx={{ '.MuiPaper-root': { height: '100%' } }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Profiländerung
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Sie können das Profilbild des Kunden ändern
            </Typography>
            <Box textAlign="center" display="flex" justifyContent="center">
              <Box>
                <AvatarUploaderById user={user} />
              </Box>
            </Box>
          </CardContent>
        </BlankCard>
      </Grid>
      {/* Passwortänderung */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Passwortänderung
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Bestätigen Sie das aktuelle Passwort des Kunden, um ein neues festzulegen
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
                        loading={isLoading || isLoadingClient}
                        disabled={props.isSubmitting || isLoading || isLoadingClient}
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
      {/* Datenbearbeitung */}
      <Grid size={12}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Datenbearbeitung des Kunden
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Hier können Sie persönliche Daten des Kunden ändern
            </Typography>
            <form>
              <Grid pb={2} container spacing={3}>
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
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="last-name">
                    Nachname
                  </CustomFormLabel>
                  <CustomTextField
                    value={data.lastName}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('lastName')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setLastName(e.target.value))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-email">
                    E-Mail
                  </CustomFormLabel>
                  <CustomTextField
                    value={data.email}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('email')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setEmail(e.target.value))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-phone">
                    Telefonnummer
                  </CustomFormLabel>
                  <CustomTextField
                    value={data.phoneNumber || ''}
                    variant="outlined"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setPhoneNumber(e.target.value))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-companyName">
                    Name der Firma
                  </CustomFormLabel>
                  <CustomTextField
                    value={clientData.companyName || ''}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('companyName')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setClientCompanyName(e.target.value))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-address">
                    Adresse
                  </CustomFormLabel>
                  <CustomTextField
                    value={data.contactDetails || ''}
                    variant="outlined"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setContactDetails(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Divider></Divider>
              <Stack direction="row" pt={3} spacing={3}>
                <Stack direction="row" alignItems="center">
                  <CustomSwitch
                    checked={clientData.status === ClientStatus.ACTIVE}
                    disabled={!hasAccess('status') || clientData.status === ClientStatus.BLACKLIST}
                    onChange={() =>
                      dispatch(
                        setClientStatus(
                          clientData.status === ClientStatus.ACTIVE
                            ? ClientStatus.INACTIVE
                            : ClientStatus.ACTIVE,
                        ),
                      )
                    }
                  />
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="last-Problematic">
                    Aktiv / Inaktiv
                  </CustomFormLabel>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <CustomSwitch
                    checked={clientData.status === ClientStatus.BLACKLIST}
                    disabled={!hasAccess('status')}
                    onChange={() =>
                      dispatch(
                        setClientStatus(
                          clientData.status === ClientStatus.BLACKLIST
                            ? ClientStatus.INACTIVE
                            : ClientStatus.BLACKLIST,
                        ),
                      )
                    }
                  />
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="last-Problematic">
                    Problemstatus
                  </CustomFormLabel>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </BlankCard>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
          <Button
            loading={isLoading || isLoadingClient}
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

export default ClientSetting;
