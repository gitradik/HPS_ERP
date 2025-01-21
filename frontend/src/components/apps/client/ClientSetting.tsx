// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect, useState, useMemo } from 'react';
import {
  CardContent,
  Grid2 as Grid,
  Typography,
  Box,
  Avatar,
  Button,
  Stack,
  MenuItem,
} from '@mui/material';

// components
import BlankCard from '../../shared/BlankCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

// images
import user1 from 'src/assets/images/profile/user-8.jpg';
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
import { useRolesWithAccess } from 'src/utils/roleAccess';
import { selectUserRole } from 'src/store/apps/auth/AuthSlice';
import { isEmpty } from 'lodash';
import { useUpdateUserMutation } from 'src/services/api/user.api';
import { useSnackbar } from 'notistack';
import { userAccessRules } from '../account-setting/AccountTabData';
import { Client } from 'src/types/client/client';
import {
  resetClientSetting,
  selectClientSetting,
  setCompanyName,
  setIsWorking,
  updateClientSetting,
} from 'src/store/apps/setting/ClientSettingSlice';
import { useUpdateClientMutation } from 'src/services/api/client.api';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { UserRole } from 'src/types/auth/auth';

const ClientSetting = ({ client }: { client: Client }) => {
  const { user, companyName, isWorking } = client;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const data = useSelector(selectAccountSetting);
  // @ts-ignore
  const clientData = useSelector(selectClientSetting);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [updateClient, { isLoading: isLoadingClient }] = useUpdateClientMutation();
  const userRole = useSelector(selectUserRole);
  const { hasAccess } = useRolesWithAccess(
    {
      ...userAccessRules,
      companyName: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      isWorking: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    userRole,
  );

  useEffect(() => {
    dispatch(updateAccountSetting(user));
    dispatch(updateClientSetting({ companyName, isWorking }));

    return () => {
      dispatch(resetAccountSetting());
      dispatch(resetClientSetting());
    };
  }, [user, companyName, isWorking]);

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
    dispatch(updateClientSetting({ companyName, isWorking }));
  };

  if (!user || isEmpty(data) || isEmpty(clientData) || isLoading || isLoadingClient) {
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
                <Avatar
                  src={user1}
                  alt={user1}
                  sx={{ width: 120, height: 120, margin: '0 auto' }}
                />
                <Stack direction="row" justifyContent="center" spacing={2} my={3}>
                  <Button variant="contained" color="primary" component="label">
                    Hochladen
                    <input hidden accept="image/*" multiple type="file" />
                  </Button>
                  <Button variant="outlined" color="error">
                    Zurücksetzen
                  </Button>
                </Stack>
                <Typography variant="subtitle1" color="textSecondary" mb={4}>
                  Erlaubte Formate: JPG, GIF oder PNG. Maximale Größe: 800KB
                </Typography>
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
            <form>
              <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-cpwd">
                Aktuelles Passwort
              </CustomFormLabel>
              <CustomTextField
                id="text-cpwd"
                value=""
                variant="outlined"
                fullWidth
                type="password"
              />
              <CustomFormLabel htmlFor="text-npwd">Neues Passwort</CustomFormLabel>
              <CustomTextField
                id="text-npwd"
                value=""
                variant="outlined"
                fullWidth
                type="password"
              />
              <CustomFormLabel htmlFor="text-conpwd">Passwort bestätigen</CustomFormLabel>
              <CustomTextField
                id="text-conpwd"
                value=""
                variant="outlined"
                fullWidth
                type="password"
              />
            </form>
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
                <Grid size={{ xs: 12, sm: 6 }}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
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
                <Grid size={{ xs: 6, sm: 3 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-active">
                    Status
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="text-active"
                    variant="outlined"
                    value={clientData.isWorking}
                    disabled={!hasAccess('isWorking')}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                      dispatch(setIsWorking(e.target.value as boolean))
                    }
                  >
                    {/* @ts-ignore */}
                    <MenuItem value={true}>Aktiv</MenuItem>
                    {/* @ts-ignore */}
                    <MenuItem value={false}>Inaktiv</MenuItem>
                  </CustomSelect>
                </Grid>
                <Grid size={{ xs: 12, sm: 9 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-companyName">
                    Name der Firma
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-companyName"
                    value={clientData.companyName || ''}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('companyName')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setCompanyName(e.target.value))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
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
          <Button onClick={() => onSave()} size="large" variant="contained" color="primary">
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
