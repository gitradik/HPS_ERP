import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { LoginResponse, UpdateUserInput, UserResponse, RegisterInput, RegisterResponse, RefreshTokenResponse, RefreshTokenInput, LogoutResponse, LoginInput } from 'src/types/auth/auth';

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

    // ***USER CRUD*** <
    getUser: builder.query<{ user: UserResponse }, { userId: string }>({
      query: ({ userId }) => ({
        document: gql`
          query Query($userId: ID!) {
            user(id: $userId) {
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
        `,
        variables: { userId },
      }),
    }),

    updateUser: builder.mutation<UserResponse, { updateId: string; input: UpdateUserInput }>({
      query: ({ updateId, input }) => ({
        document: gql`
          mutation Mutation($updateId: ID!, $input: UpdateUserInput!) {
            update(id: $updateId, input: $input) {
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
        `,
        variables: {
          updateId,
          input,
        },
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
  useGetUserQuery,
  useUpdateUserMutation
} = authApi;

export default authApi;
