import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { Employee, EmployeeResponse } from 'src/types/employee/employee';
import { GetAllQueryParams } from 'src/types/query';

const employeeApi = createApi({
  reducerPath: 'employeeApi',
  tagTypes: ['Employees', 'Employee'],
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getEmployees: builder.query<
      { items: EmployeeResponse[]; totalCount: number },
      GetAllQueryParams<Employee>
    >({
      query: (queryParams) => ({
        document: gql`
          query GetEmployees($queryParams: EmployeeQueryParams) {
            employees(queryParams: $queryParams) {
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
              }
              totalCount
            }
          }
        `,
        variables: { queryParams },
      }),
      transformResponse: (response: {
        employees: { items: EmployeeResponse[]; totalCount: number };
      }) => {
        return response.employees;
      },
      providesTags: ['Employees'],
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
