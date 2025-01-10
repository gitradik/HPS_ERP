import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { gql } from 'graphql-request';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: graphqlRequestBaseQuery({
    url: 'http://localhost:4000/graphql',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginInput>({
      query: ({ email, phoneNumber, password }) => {
        return {
          document: gql`
            mutation Login($email: String, $phoneNumber: String, $password: String!) {
              login(email: $email, phoneNumber: $phoneNumber, password: $password) {
                accessToken
                refreshToken
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
              id
              email
              firstName
              lastName
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
              accessToken
              refreshToken
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

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface LogoutResponse {
  success: boolean;
}
