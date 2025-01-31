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
      providesTags: (result) =>
        result
          ? [
              { type: 'Schedules' as const, id: 'LIST' }, // Тег для всего списка
              ...result.schedules.map(({ id }) => ({ type: 'Schedule' as const, id })), // Теги для каждого расписания
            ]
          : [{ type: 'Schedules' as const, id: 'LIST' }], // Если результат пуст, инвалидируем только список
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
      providesTags: (_result, _error, { scheduleId }) => [
        { type: 'Schedule' as const, id: scheduleId },
      ],
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
      providesTags: (result, _error, { staffId }) =>
        result
          ? [
              { type: 'Schedules' as const, id: staffId }, // Тег для расписаний конкретного сотрудника
              ...result.schedulesByStaffId.map(({ id }) => ({ type: 'Schedule' as const, id })), // Теги для каждого расписания
            ]
          : [{ type: 'Schedules' as const, id: staffId }], // Если результат пуст, инвалидируем только список
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
      invalidatesTags: [{ type: 'Schedules' as const, id: 'LIST' }], // Инвалидируем список расписаний
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Schedule' as const, id }, // Инвалидируем конкретное расписание
        { type: 'Schedules' as const, id: 'LIST' }, // Инвалидируем список расписаний
      ],
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
      invalidatesTags: [{ type: 'Schedules' as const, id: 'LIST' }], // Инвалидируем список расписаний
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
