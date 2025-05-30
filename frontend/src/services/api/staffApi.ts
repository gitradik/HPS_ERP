import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { Staff, StaffResponse } from 'src/types/staff/staff';
import { GetAllQueryParams } from 'src/types/query';

const staffApi = createApi({
  reducerPath: 'staffApi',
  tagTypes: ['Staffs', 'Staff'],
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getStaffs: builder.query<
      { items: StaffResponse[]; totalCount: number },
      GetAllQueryParams<Staff>
    >({
      query: (queryParams) => ({
        document: gql`
          query GetStaffs($queryParams: StaffQueryParams) {
            staffs(queryParams: $queryParams) {
              items {
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
                  photo
                }
                isAssigned
              }
              totalCount
            }
          }
        `,
        variables: { queryParams },
      }),
      transformResponse: (response: { staffs: { items: StaffResponse[]; totalCount: number } }) =>
        response.staffs,
      providesTags: (result) =>
        result
          ? [
              { type: 'Staffs' as const, id: 'LIST' }, // Тег для всего списка
              ...result.items.map(({ id }) => ({ type: 'Staff' as const, id })), // Теги для каждого сотрудника
            ]
          : [{ type: 'Staffs' as const, id: 'LIST' }], // Если результат пуст, инвалидируем только список
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
                photo
              }
              isAssigned
            }
          }
        `,
        variables: { staffId },
      }),
      providesTags: (_result, _error, { staffId }) => [{ type: 'Staff' as const, id: staffId }], // Тег для конкретного сотрудника
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
                photo
              }
              isAssigned
            }
          }
        `,
        variables: { userId },
      }),
      invalidatesTags: [{ type: 'Staffs' as const, id: 'LIST' }], // Инвалидируем список сотрудников
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
                photo
              }
              isAssigned
            }
          }
        `,
        variables: { id, input },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Staff' as const, id }, // Инвалидируем конкретного сотрудника
        { type: 'Staffs' as const, id: 'LIST' }, // Инвалидируем список сотрудников
      ],
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
