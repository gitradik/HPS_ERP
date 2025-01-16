import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { LoginResponse, RegisterInput, RegisterResponse, RefreshTokenResponse, RefreshTokenInput, LogoutResponse, LoginInput } from 'src/types/auth/auth';

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<{ login: LoginResponse }, LoginInput>({
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
    register: builder.mutation<{ register: RegisterResponse }, RegisterInput>({
      query: (newUser) => ({
        document: gql`
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
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
        variables: {
          input: newUser
        },
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
    // ***USER CRUD*** >
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;

export default authApi;
