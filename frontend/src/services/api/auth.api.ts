import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginInput>({
      query: ({ email, phoneNumber, password }) => {
        return {
          document: gql`
            mutation Login($email: String, $phoneNumber: String, $password: String!) {
              login(email: $email, phoneNumber: $phoneNumber, password: $password) {
                success
                message
                accessToken
                refreshToken
                user {
                  id
                  role
                  email
                  phoneNumber
                  firstName
                  lastName
                  position
                  contactDetails
                  isActive
                  updatedAt
                  createdAt
                }
              }
            }
          `,
          variables: {
            email,
            phoneNumber,
            password,
          },
        };
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterInput>({
      query: (newUser) => ({
        document: gql`
          mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
            register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
              success
              message
              user {
                id
                role
                email
                phoneNumber
                firstName
                lastName
                position
                contactDetails
                isActive
                updatedAt
                createdAt
              }
            }
          }
        `,
        variables: newUser,
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenInput>({
      query: (token) => ({
        document: gql`
          mutation RefreshToken($refreshToken: String!) {
            refreshToken(refreshToken: $refreshToken) {
              success
              message
              accessToken
              refreshToken
              user {
                id
                role
                email
                phoneNumber
                firstName
                lastName
                position
                contactDetails
                isActive
                updatedAt
                createdAt
              }
            }
          }
        `,
        variables: token,
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        document: gql`
          mutation Logout {
            logout {
              success
              message
            }
          }
        `,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;

export default authApi;

// Типы для запросов и ответов
interface LoginInput {
  email?: string; // Универсальное поле для email или телефона
  phoneNumber?: string; // Универсальное поле для email или телефона
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user?: any
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}

interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user?: any
}

interface LogoutResponse {
  success: boolean;
}
