import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { StaffResponse } from 'src/types/staff/staff';

const staffApi = createApi({
  reducerPath: 'staffApi',
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getStaffs: builder.query<{ staffs: StaffResponse[] }, void>({
      query: () => ({
        document: gql`
          query GetStaffs {
            staffs {
              id
              userId
              createdAt
              updatedAt
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
              isAssigned
            }
          }
        `,
      }),
    }),

    getStaff: builder.query<{ staff: StaffResponse }, { staffId: string }>({
      query: ({ staffId }) => ({
        document: gql`
          query GetStaff($staffId: ID!) {
            staff(id: $staffId) {
              id
              userId
              createdAt
              updatedAt
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
              isAssigned
            }
          }
        `,
        variables: { staffId },
      }),
    }),

    createStaff: builder.mutation<StaffResponse, { userId: number }>({
      query: ({ userId }) => ({
        document: gql`
          mutation CreateStaff($userId: ID!) {
            createStaff(input: { userId: $userId }) {
              id
              userId
              createdAt
              updatedAt
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
              isAssigned
            }
          }
        `,
        variables: { userId },
      }),
    }),

    updateStaff: builder.mutation<StaffResponse, { id: number; input: { isAssigned: boolean } }>({
      query: ({ id, input }) => ({
        document: gql`
          mutation UpdateStaff($id: ID!, $input: UpdateStaffInput!) {
            updateStaff(input: $input) {
              id
              userId
              createdAt
              updatedAt
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
              isAssigned
            }
          }
        `,
        variables: { id, input },
      }),
    }),
  }),
});

export const {
  useGetStaffsQuery,
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
} = staffApi;

export default staffApi;
