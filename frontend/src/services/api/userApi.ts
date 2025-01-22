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
              photo
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
              photo
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
              photo
            }
          }
        `,
        variables: {
          updateId,
          input,
        },
      }),
    }),

    
    uploadPhoto: builder.mutation({
      query: ({ file }: { file: File }) => ({
        document: gql`
          mutation Mutation($file: Upload!) {
            uploadPhoto(file: $file) {
              filename
              mimetype
              encoding
            }
          }
        `,
        variables: { file },
      }),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation, useUploadPhotoMutation } = userApi;

export default userApi;
