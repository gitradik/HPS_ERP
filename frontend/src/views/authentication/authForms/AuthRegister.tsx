import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'src/store/Store';
import { useRegisterMutation } from 'src/services/api/authApi';

import { registerType } from 'src/types/auth/auth';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import {
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setPassword,
  setConfirmPassword,
  selectRegister,
  registerFailure,
  registerSuccess,
  registerRequest,
} from 'src/store/auth/RegisterSlice';
import { useSelector } from 'react-redux';
import { emailRegex, phoneRegex } from 'src/utils/regex';
import { useSnackbar } from 'notistack';

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const { firstName, lastName, email, phoneNumber, password, confirmPassword } =
    useSelector(selectRegister);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [register, { isLoading, error }] = useRegisterMutation();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // @ts-ignore
  const errorMessage = (error?.data as any)?.friendlyMessage;

  const handleRegister = async () => {
    setValidationError(null);

    if (!firstName || !lastName || !(email || phoneNumber) || !password || !confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const isEmail = email && email.match(emailRegex);
    const isPhone = phoneNumber && phoneNumber.match(phoneRegex);

    if (!isEmail && !isPhone) {
      setValidationError('Please enter a valid email.');
      return;
    }

    try {
      dispatch(registerRequest());

      await register({
        firstName,
        lastName,
        email: isEmail ? email : undefined,
        phoneNumber: isPhone ? phoneNumber : undefined,
        password,
      }).unwrap();

      dispatch(registerSuccess());

      navigate('/');
      enqueueSnackbar('Registrierung erfolgreich!', { variant: 'success', autoHideDuration: 1500 });
      enqueueSnackbar('Sie können sich jetzt einloggen.', {
        variant: 'info',
        autoHideDuration: 3000,
      });
    } catch (err: any) {
      dispatch(registerFailure(err));
      enqueueSnackbar(err?.data.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleRegister();
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

      <form onKeyDown={handleKeyDown}>
        <Stack>
          <Box>
            {validationError && (
              <Typography color="error" variant="body2" mt={2}>
                {validationError}
              </Typography>
            )}
          </Box>
          <Box>
            {errorMessage && (
              <Typography color="error" variant="body2" mt={2}>
                {errorMessage}
              </Typography>
            )}
          </Box>

          <Box>
            <CustomFormLabel htmlFor="first-name">Vorname</CustomFormLabel>
            <CustomTextField
              id="first-name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setFirstName(e.target.value))
              }
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="last-name">Nachname</CustomFormLabel>
            <CustomTextField
              id="last-name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setLastName(e.target.value))
              }
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="emailOrPhone">E-Mail</CustomFormLabel>
            <CustomTextField
              id="emailOrPhone"
              variant="outlined"
              fullWidth
              value={email || phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                e.target.value.includes('@')
                  ? dispatch(setEmail(e.target.value))
                  : dispatch(setPhoneNumber(e.target.value))
              }
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="password">Passwort</CustomFormLabel>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setPassword(e.target.value))
              }
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="confirm-password">Passwort bestätigen</CustomFormLabel>
            <CustomTextField
              id="confirm-password"
              type="password"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setConfirmPassword(e.target.value))
              }
            />
          </Box>
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleRegister}
            disabled={isLoading}
          >
            Registrieren
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  );
};

export default AuthRegister;
