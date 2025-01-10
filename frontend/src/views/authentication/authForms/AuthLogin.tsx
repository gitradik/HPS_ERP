// src/components/authForms/AuthLogin.tsx
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
import { Link } from 'react-router';
import { useLoginMutation } from 'src/services/api/auth.api'; // Подключаем хук для мутации логина

import { loginType } from 'src/types/auth/auth';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';
import { emailRegex, phoneRegex } from 'src/utils/regex';

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [emailOrPhone, setEmailOrPhone] = useState(''); // Состояние для поля email/phone
  const [password, setPassword] = useState(''); // Состояние для пароля
  const [login, { isLoading, error }] = useLoginMutation(); // Используем хук мутации

  // Обработка отправки формы
  const handleLogin = async () => {
    try {
      await login({
        email: emailOrPhone.match(emailRegex) ? emailOrPhone : undefined,
        phoneNumber: emailOrPhone.match(phoneRegex) ? emailOrPhone : undefined,
        password
      }); // Делаем запрос на логин
    } catch (err) {
      console.error('Login failed', err);
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
          {error && (
            <Typography color="error" variant="body2" mt={2}>
              {/* @ts-ignore */}
              {error?.data?.message || 'An error occurred during login.'}
            </Typography>
          )}
        </Box>
        <Box>
          <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
          <CustomTextField
            id="username"
            variant="outlined"
            fullWidth
            value={emailOrPhone}
            onChange={(e: any) => setEmailOrPhone(e.target.value)}
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
            onChange={(e: any) => setPassword(e.target.value)}
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
