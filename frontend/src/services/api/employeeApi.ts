import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { EmployeeResponse } from 'src/types/employee/employee';

const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getEmployees: builder.query<{ employees: EmployeeResponse[] }, void>({
      query: () => ({
        document: gql`
          query GetEmployees {
            employees {
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
            }
          }
        `,
      }),
    }),

    getEmployee: builder.query<{ employee: EmployeeResponse }, { employeeId: string }>({
      query: ({ employeeId }) => ({
        document: gql`
          query GetEmployee($employeeId: ID!) {
            employee(id: $employeeId) {
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
            }
          }
        `,
        variables: { employeeId },
      }),
    }),

    createEmployee: builder.mutation<EmployeeResponse, { userId: number }>({
      query: ({ userId }) => ({
        document: gql`
          mutation CreateEmployee($userId: ID!) {
            createEmployee(input: { userId: $userId }) {
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
            }
          }
        `,
        variables: { userId },
      }),
    }),
  }),
});

export const { useGetEmployeesQuery, useGetEmployeeQuery, useCreateEmployeeMutation } = employeeApi;

export default employeeApi;
