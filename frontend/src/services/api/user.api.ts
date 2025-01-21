import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { UpdateUserInput, UserResponse } from 'src/types/auth/auth';

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<{ users: UserResponse[] }, void>({
      query: () => ({
        document: gql`
          query Query {
            users {
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
      }),
    }),
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
    updateUser: builder.mutation<
      { update: UserResponse },
      { updateId: string; input: UpdateUserInput }
    >({
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
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation } = userApi;

export default userApi;
