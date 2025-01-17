// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect, useState } from 'react';
import { CardContent, Grid2 as Grid, Typography, MenuItem, Box, Avatar, Button, Stack } from '@mui/material';

// components
import BlankCard from '../../shared/BlankCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../forms/theme-elements/CustomSelect';

// images
import user1 from 'src/assets/images/profile/user-1.jpg';
import { User, UserRole } from 'src/types/auth/auth';
import Spinner from 'src/views/spinner/Spinner';
import { selectAccountSetting, setContactDetails, setEmail, setFirstName, setIsActive, setLastName, setPhoneNumber, setPosition, setRole, updateAccountSettings } from 'src/store/apps/accountSetting/AccountSettingSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { useRolesWithAccess } from 'src/utils/roleAccess';
import { actives, roles, userAccessRules } from './AccountTabData';
import { updateUserSuccess } from 'src/store/apps/auth/AuthSlice';
import { isEmpty } from 'lodash';
import { useUpdateUserMutation } from 'src/services/api/user.api';
import { useSnackbar } from 'notistack';



const AccountTab = ({ user }: { user: User }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const data = useSelector(selectAccountSetting);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { hasAccess } = useRolesWithAccess(userAccessRules, user.role);

  useEffect(() => {
    dispatch(updateAccountSettings(user));
  }, [user]);

  const onSave = async () => {
    try {
      const result = await updateUser({ updateId: user.id, input: data }).unwrap();
      dispatch(updateUserSuccess(result.update));
      
      enqueueSnackbar('Benutzer erfolgreich aktualisiert!', { variant: "success", autoHideDuration: 3000 });
    } catch ({ data }: any) {
      enqueueSnackbar(data.friendlyMessage, { variant: "error", autoHideDuration: 3000 });
    }
  };
  const onCancel = async () => {
    dispatch(updateAccountSettings(user));
  };

  if (!user || isEmpty(data) || isLoading) {
    return <Spinner />;
  }

  return (
    (<Grid container spacing={3}>
      {/* Change Profile */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Profil ändern
            </Typography>
            <Typography color="textSecondary" mb={3}>Ändern Sie Ihr Profilbild hier</Typography>
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
                  Erlaubte Formate: JPG, GIF oder PNG. Maximalgröße: 800K
                </Typography>
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
            <Typography color="textSecondary" mb={3}>Bestätigen Sie hier Ihr Passwort, um es zu ändern</Typography>
            <form>
              <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-cpwd">
                Aktuelles Passwort
              </CustomFormLabel>
              <CustomTextField
                id="text-cpwd"
                value="MathewAnderson"
                variant="outlined"
                fullWidth
                type="password"
              />
              {/* 2 */}
              <CustomFormLabel htmlFor="text-npwd">Neues Passwort</CustomFormLabel>
              <CustomTextField
                id="text-npwd"
                value="MathewAnderson"
                variant="outlined"
                fullWidth
                type="password"
              />
              {/* 3 */}
              <CustomFormLabel htmlFor="text-conpwd">Bestätigen Sie das Passwort</CustomFormLabel>
              <CustomTextField
                id="text-conpwd"
                value="MathewAnderson"
                variant="outlined"
                fullWidth
                type="password"
              />
            </form>
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
            <Typography color="textSecondary" mb={3}>Um Ihre persönlichen Angaben zu ändern, bearbeiten und speichern Sie sie hier</Typography>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setFirstName(e.target.value))}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setLastName(e.target.value))}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setEmail(e.target.value))}
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
                    value={data.phoneNumber || ""}
                    variant="outlined"
                    disabled={!hasAccess('phoneNumber')}
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setPhoneNumber(e.target.value))}
                  />
                </Grid>
                {/* role */}
                <Grid size={{ xs: 6, sm: 3 }}>
                  {/* 3 */}
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-role">
                    Rolle
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="text-role"
                    variant="outlined"
                    value={data.role}
                    disabled={!hasAccess('role')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setRole(e.target.value as UserRole))}
                  >
                    {roles.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                {/* active */}
                <Grid size={{ xs: 6, sm: 3 }}>
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-active">
                    Aktiv
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="text-active"
                    variant="outlined"
                    value={data.isActive}
                    disabled={!hasAccess('isActive')}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => dispatch(setIsActive(e.target.value === "true"))}
                  >
                    {actives.map((option) => (
                      <MenuItem key={option.label} value={String(option.value)}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                {/* position */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  {/* 6 */}
                  <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-position">
                    Position
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-position"
                    value={data.position || ""}
                    variant="outlined"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setPosition(e.target.value))}
                  />
                </Grid>
                <Grid size={12}>
                  {/* 7 */}
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
    </Grid>
    )
  );
};

export default AccountTab;

