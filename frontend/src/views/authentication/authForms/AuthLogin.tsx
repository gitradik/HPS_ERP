import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Обратите внимание: 'react-router-dom', а не 'react-router'
import { useLoginMutation } from 'src/services/api/auth.api';

import { loginType } from 'src/types/auth/auth';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';
import { emailRegex, phoneRegex } from 'src/utils/regex';
import { useDispatch } from 'src/store/Store';
import { loginFailure, loginRequest, loginSuccess } from 'src/store/apps/auth/AuthSlice';

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // @ts-ignore
  const errorMessage = (error?.data as any)?.friendlyMessage;


  const handleLogin = async () => {
    setValidationError(null);

    const isEmail = emailOrPhone.match(emailRegex);
    const isPhone = emailOrPhone.match(phoneRegex);
    if (!isEmail && !isPhone) {
      setValidationError('Please enter a valid email or phone number.');
      return;
    }

    if (!password) {
      setValidationError('Password cannot be empty.');
      return;
    }

    try {
      dispatch(loginRequest());
      const res = await login({
        email: isEmail ? emailOrPhone : undefined,
        phoneNumber: isPhone ? emailOrPhone : undefined,
        password,
      }).unwrap();
      dispatch(loginSuccess(res.login));
      navigate('/');
    } catch (err: any) {
      dispatch(loginFailure(err));
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

      <AuthSocialButtons title="Sign in with" />
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign in with
          </Typography>
        </Divider>
      </Box>

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
          <CustomFormLabel htmlFor="emailOrPhone">Email or Phone Number</CustomFormLabel>
          <CustomTextField
            id="emailOrPhone"
            variant="outlined"
            fullWidth
            value={emailOrPhone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmailOrPhone(e.target.value)
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
              setPassword(e.target.value)
            }
          />
        </Box>
        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            <FormControlLabel
              control={<CustomCheckbox defaultChecked />}
              label="Remember this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>

      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Sign In'}
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthLogin;
