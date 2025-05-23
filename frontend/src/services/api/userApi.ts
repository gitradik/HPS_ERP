import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { UpdateUserInput, UserResponse } from 'src/types/auth/auth';
import { GetAllQueryParams } from 'src/types/query';
import { User } from 'src/types/user/user';

const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['Users', 'User'],
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<{ items: UserResponse[]; totalCount: number }, GetAllQueryParams<User>>(
      {
        query: (queryParams) => ({
          document: gql`
            query GetUsers($queryParams: UserQueryParams) {
              users(queryParams: $queryParams) {
                items {
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
                totalCount
              }
            }
          `,
          variables: { queryParams },
        }),
        transformResponse: (response: { users: { items: UserResponse[]; totalCount: number } }) =>
          response.users,
        providesTags: (result) =>
          result
            ? [
                { type: 'Users' as const, id: 'LIST' }, // Tag for all users list
                ...result.items.map(({ id }) => ({ type: 'User' as const, id })), // Tag for every clients
              ]
            : [{ type: 'Users' as const, id: 'LIST' }], // If list is empty do invalidation only list
      },
    ),

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
      providesTags: (_result, _error, { userId }) => [{ type: 'User' as const, id: userId }], // Тег для конкретного пользователя
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
      invalidatesTags: (_result, _error, { updateId }) => [
        { type: 'User' as const, id: updateId }, // Инвалидируем конкретного пользователя
        { type: 'Users' as const, id: 'LIST' }, // Инвалидируем список пользователей
      ],
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
      invalidatesTags: [{ type: 'Users' as const, id: 'LIST' }], // Инвалидируем список пользователей
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation, useUploadPhotoMutation } =
  userApi;

export default userApi;
