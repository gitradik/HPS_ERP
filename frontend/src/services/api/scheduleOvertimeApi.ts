import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { ScheduleOvertime } from 'src/types/schedule/schedule';

const scheduleOvertimeApi = createApi({
  reducerPath: 'scheduleOvertimeApi',
  tagTypes: ['ScheduleOvertimes', 'ScheduleOvertime'],
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getScheduleOvertimes: builder.query({
      query: () => ({
        document: gql`
          query GetScheduleOvertimes {
            scheduleOvertimes {
              id
              schedule {
                id
              }
              date
              hours
              type
              createdAt
              updatedAt
            }
          }
        `,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'ScheduleOvertimes', id: 'LIST' },
              ...result.scheduleOvertimes.map(({ id }: ScheduleOvertime) => ({
                type: 'ScheduleOvertime',
                id,
              })),
            ]
          : [{ type: 'ScheduleOvertimes', id: 'LIST' }],
    }),

    getScheduleOvertime: builder.query({
      query: ({ id }) => ({
        document: gql`
          query GetScheduleOvertime($id: ID!) {
            scheduleOvertime(id: $id) {
              id
              schedule {
                id
              }
              date
              hours
              type
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id },
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'ScheduleOvertime', id }],
    }),

    getScheduleOvertimesByScheduleId: builder.query({
      query: ({ scheduleId }) => ({
        document: gql`
          query GetScheduleOvertimesByScheduleId($scheduleId: ID!) {
            scheduleOvertimesByScheduleId(scheduleId: $scheduleId) {
              id
              date
              schedule {
                id
              }
              hours
              type
              createdAt
              updatedAt
            }
          }
        `,
        variables: { scheduleId },
      }),
      providesTags: (result, _error, { scheduleId }) =>
        result
          ? [
              { type: 'ScheduleOvertimes', id: scheduleId },
              ...result.scheduleOvertimesByScheduleId.map(({ id }: ScheduleOvertime) => ({
                type: 'ScheduleOvertime',
                id,
              })),
            ]
          : [{ type: 'ScheduleOvertimes', id: scheduleId }],
    }),

    createScheduleOvertime: builder.mutation({
      query: (input) => ({
        document: gql`
          mutation CreateScheduleOvertime($input: CreateScheduleOvertimeInput!) {
            createScheduleOvertime(input: $input) {
              id
              schedule {
                id
              }
              date
              hours
              type
              createdAt
              updatedAt
            }
          }
        `,
        variables: { input },
      }),
      invalidatesTags: [{ type: 'ScheduleOvertimes', id: 'LIST' }],
    }),

    updateScheduleOvertime: builder.mutation({
      query: (input) => ({
        document: gql`
          mutation UpdateScheduleOvertime($input: UpdateScheduleOvertimeInput!) {
            updateScheduleOvertime(input: $input) {
              id
              schedule {
                id
              }
              date
              hours
              type
              createdAt
              updatedAt
            }
          }
        `,
        variables: { input },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ScheduleOvertime', id },
        { type: 'ScheduleOvertimes', id: 'LIST' },
      ],
    }),

    deleteScheduleOvertime: builder.mutation({
      query: ({ id }) => ({
        document: gql`
          mutation DeleteScheduleOvertime($id: ID!) {
            deleteScheduleOvertime(id: $id)
          }
        `,
        variables: { id },
      }),
      invalidatesTags: [{ type: 'ScheduleOvertimes', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetScheduleOvertimesQuery,
  useGetScheduleOvertimeQuery,
  useGetScheduleOvertimesByScheduleIdQuery,
  useCreateScheduleOvertimeMutation,
  useUpdateScheduleOvertimeMutation,
  useDeleteScheduleOvertimeMutation,
} = scheduleOvertimeApi;

export default scheduleOvertimeApi;
