import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'src/store/Store';
import { useRegisterMutation } from 'src/services/api/auth.api';

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
} from 'src/store/apps/auth/RegisterSlice';
import { useSelector } from 'react-redux';
import { emailRegex, phoneRegex } from 'src/utils/regex';
import { addNotification } from 'src/store/apps/notifications/NotificationsSlice';

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const { firstName, lastName, email, phoneNumber, password, confirmPassword } = useSelector(selectRegister);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [register, { isLoading, error }] = useRegisterMutation();
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
      
      dispatch(addNotification({
        message: 'Registration successful!\nYou can now log in.',
        type: 'success',
        autoHideDuration: 3000,
      }));
    } catch (err: any) {
      dispatch(registerFailure(err));
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
          <CustomFormLabel htmlFor="first-name">First Name</CustomFormLabel>
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
          <CustomFormLabel htmlFor="last-name">Last Name</CustomFormLabel>
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
          <CustomFormLabel htmlFor="emailOrPhone">Email</CustomFormLabel>
          <CustomTextField
            id="emailOrPhone"
            variant="outlined"
            fullWidth
            value={email || phoneNumber} // Use whichever one is populated
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.target.value.includes('@')
                ? dispatch(setEmail(e.target.value))
                : dispatch(setPhoneNumber(e.target.value))
            }
          />
        </Box>

        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
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
          <CustomFormLabel htmlFor="confirm-password">Confirm Password</CustomFormLabel>
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

      <Box sx={{mt: 4}}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? 'Wird registriert...' : 'Registrieren'}
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
