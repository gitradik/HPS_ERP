// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect, useState } from 'react';
import { CardContent, Grid2 as Grid, Typography, Box, Avatar, Button, Stack } from '@mui/material';

// components
import BlankCard from '../../shared/BlankCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

// images
import user1 from 'src/assets/images/profile/user-1.jpg';
import Spinner from 'src/views/spinner/Spinner';
import { resetAccountSetting, selectAccountSetting, setContactDetails, setEmail, setFirstName, setLastName, setPhoneNumber, setPosition, updateAccountSetting } from 'src/store/apps/setting/AccountSettingSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { useRolesWithAccess } from 'src/utils/roleAccess';
import { selectUserRole } from 'src/store/apps/auth/AuthSlice';
import { isEmpty } from 'lodash';
import { useUpdateUserMutation } from 'src/services/api/user.api';
import { useSnackbar } from 'notistack';
import { Employee } from 'src/types/employee/employee';
import { userAccessRules } from '../account-setting/AccountTabData';

const EmployeeSetting = ({ employee }: { employee: Employee }) => {
  const { user } = employee;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const data = useSelector(selectAccountSetting);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const userRole = useSelector(selectUserRole);
  const { hasAccess } = useRolesWithAccess(userAccessRules, userRole);

  useEffect(() => {
    dispatch(updateAccountSetting(user));

    return () => {
      dispatch(resetAccountSetting());
    };
  }, [user]);

  const onSave = async () => {
    try {
      await updateUser({ updateId: user.id, input: data }).unwrap();
      enqueueSnackbar('Mitarbeiterdaten erfolgreich aktualisiert!', { variant: "success", autoHideDuration: 3000 });
    } catch ({ data }: any) {
      enqueueSnackbar(data.friendlyMessage, { variant: "error", autoHideDuration: 3000 });
    }
  };
  const onCancel = async () => {
    dispatch(updateAccountSetting(user));
  };

  if (!user || isEmpty(data) || isLoading) {
    return <Spinner />;
  }

  return (
    (<Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }} sx={{ '.MuiPaper-root': { height: '100%' } }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Profiländerung
            </Typography>
            <Typography color="textSecondary" mb={3}>Sie können das Profilbild des Mitarbeiters ändern</Typography>
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
            <Typography color="textSecondary" mb={3}>Bestätigen Sie das aktuelle Passwort des Mitarbeiters, um ein neues festzulegen</Typography>
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
              Datenbearbeitung des Mitarbeiters
            </Typography>
            <Typography color="textSecondary" mb={3}>Hier können Sie persönliche Daten des Mitarbeiters ändern</Typography>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setFirstName(e.target.value))}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setLastName(e.target.value))}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setEmail(e.target.value))}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-position">
                    Position
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-position"
                    value={data.position || ""}
                    variant="outlined"
                    fullWidth
                    disabled={!hasAccess('position')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setPosition(e.target.value))}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-phone">
                    Telefonnummer
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-phone"
                    value={data.phoneNumber || ""}
                    variant="outlined"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setPhoneNumber(e.target.value))}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-address">
                    Adresse
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-address"
                    value={data.contactDetails || ""}
                    variant="outlined"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setContactDetails(e.target.value))}
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
    </Grid>)
  );
};

export default EmployeeSetting;
