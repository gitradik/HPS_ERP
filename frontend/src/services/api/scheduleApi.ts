import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import {
  CreateScheduleInput,
  ScheduleResponse,
  UpdateScheduleInput,
} from 'src/types/schedule/schedule';

const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  tagTypes: ['Schedules', 'Schedule'],
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getSchedules: builder.query<{ schedules: ScheduleResponse[] }, void>({
      query: () => ({
        document: gql`
          query GetSchedules {
            schedules {
              id
              title
              allDay
              start
              end
              color
              status
              createdAt
              updatedAt
              staff {
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
              client {
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
                companyName
                isWorking
              }
            }
          }
        `,
      }),
      providesTags: ['Schedules'], // Добавляем тег для получения всех расписаний
    }),

    getSchedule: builder.query<{ schedule: ScheduleResponse }, { scheduleId: string }>({
      query: ({ scheduleId }) => ({
        document: gql`
          query GetSchedule($scheduleId: ID!) {
            schedule(id: $scheduleId) {
              id
              title
              allDay
              start
              end
              color
              status
              createdAt
              updatedAt
              staff {
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
              client {
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
                companyName
                isWorking
              }
            }
          }
        `,
        variables: { scheduleId },
      }),
      providesTags: (_result, _error, { scheduleId }) => [{ type: 'Schedule', id: scheduleId }],
    }),

    getSchedulesByStaffId: builder.query<
      { schedulesByStaffId: ScheduleResponse[] },
      { staffId: string }
    >({
      query: ({ staffId }) => ({
        document: gql`
          query GetSchedulesByStaffId($staffId: ID!) {
            schedulesByStaffId(staffId: $staffId) {
              id
              title
              allDay
              start
              end
              color
              status
              createdAt
              updatedAt
              client {
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
                companyName
                isWorking
              }
            }
          }
        `,
        variables: { staffId },
      }),
      providesTags: (_result, _error, { staffId }) => [{ type: 'Schedules', id: staffId }],
    }),

    createSchedule: builder.mutation<ScheduleResponse, CreateScheduleInput>({
      query: (input) => ({
        document: gql`
          mutation CreateSchedule($input: CreateScheduleInput!) {
            createSchedule(input: $input) {
              id
              title
              allDay
              start
              end
              color
              status
              createdAt
              updatedAt
              staff {
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
              client {
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
                companyName
                isWorking
              }
            }
          }
        `,
        variables: { input },
      }),
      // Invalidates the 'Schedules' tag to refetch the list of schedules after creating a new one
      invalidatesTags: ['Schedules'],
    }),

    updateSchedule: builder.mutation<ScheduleResponse, UpdateScheduleInput>({
      query: (input) => ({
        document: gql`
          mutation UpdateSchedule($input: UpdateScheduleInput!) {
            updateSchedule(input: $input) {
              id
              title
              allDay
              start
              end
              color
              status
              createdAt
              updatedAt
              staff {
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
              client {
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
                companyName
                isWorking
              }
            }
          }
        `,
        variables: { input },
      }),
      // Invalidates the specific schedule and the 'Schedules' tag to refetch updated data
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Schedule', id }, 'Schedules'],
    }),

    deleteSchedule: builder.mutation<boolean, { id: string }>({
      query: ({ id }) => ({
        document: gql`
          mutation DeleteSchedule($id: ID!) {
            deleteSchedule(id: $id)
          }
        `,
        variables: { id },
      }),
      // Invalidates the 'Schedules' tag to refetch the list of schedules after deletion
      invalidatesTags: ['Schedules'],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetScheduleQuery,
  useGetSchedulesByStaffIdQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = scheduleApi;

export default scheduleApi;
