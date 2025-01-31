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
      providesTags: (result) =>
        result
          ? [
              { type: 'Employees' as const, id: 'LIST' },
              ...result.items.map(({ id }) => ({ type: 'Employee' as const, id })),
            ]
          : [{ type: 'Employees' as const, id: 'LIST' }],
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
      providesTags: (result) =>
        result ? [{ type: 'Employee' as const, id: result.employee.id }] : [],
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
      // Use `invalidatesTags` instead of `providesTags` for mutations
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Employees', id: 'LIST' }, // Invalidate the list of employees
              { type: 'Employee', id: result.id }, // Invalidate the specific employee
            ]
          : [{ type: 'Employees', id: 'LIST' }], // Fallback to invalidating the list
    }),
  }),
});

export const { useGetEmployeesQuery, useGetEmployeeQuery, useCreateEmployeeMutation } = employeeApi;

export default employeeApi;
