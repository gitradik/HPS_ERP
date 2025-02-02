import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { Client, ClientResponse, UpdateClientInput } from 'src/types/client/client';
import { GetAllQueryParams } from 'src/types/query';

const clientApi = createApi({
  reducerPath: 'clientApi',
  tagTypes: ['Clients', 'Client'],
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getClients: builder.query<
      { items: ClientResponse[]; totalCount: number },
      GetAllQueryParams<Client>
    >({
      query: (queryParams) => ({
        document: gql`
          query GetClients($queryParams: ClientQueryParams) {
            clients(queryParams: $queryParams) {
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
                companyName
                status
              }
              totalCount
            }
          }
        `,
        variables: { queryParams },
      }),
      transformResponse: (response: {
        clients: { items: ClientResponse[]; totalCount: number };
      }) => {
        return response.clients;
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Clients' as const, id: 'LIST' }, // Тег для всего списка клиентов
              ...result.items.map(({ id }) => ({ type: 'Client' as const, id })), // Теги для каждого клиента
            ]
          : [{ type: 'Clients' as const, id: 'LIST' }], // Если результат пуст, инвалидируем только список
    }),

    getClient: builder.query<{ client: ClientResponse }, { clientId: string }>({
      query: ({ clientId }) => ({
        document: gql`
          query GetClient($clientId: ID!) {
            client(id: $clientId) {
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
              status
            }
          }
        `,
        variables: { clientId },
      }),
      providesTags: (_result, _error, { clientId }) => [{ type: 'Client' as const, id: clientId }], // Тег для конкретного клиента
    }),

    createClient: builder.mutation<ClientResponse, { userId: number }>({
      query: ({ userId }) => ({
        document: gql`
          mutation CreateClient($userId: ID!) {
            createClient(input: { userId: $userId }) {
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
              status
            }
          }
        `,
        variables: { userId },
      }),
      invalidatesTags: [{ type: 'Clients' as const, id: 'LIST' }], // Инвалидируем список клиентов
    }),

    updateClient: builder.mutation<
      { updateClient: ClientResponse },
      { updateId: string; input: UpdateClientInput }
    >({
      query: ({ updateId, input }) => ({
        document: gql`
          mutation Mutation($updateId: ID!, $input: UpdateClientInput!) {
            updateClient(id: $updateId, input: $input) {
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
              status
            }
          }
        `,
        variables: { updateId, input },
      }),
      invalidatesTags: (_result, _error, { updateId }) => [
        { type: 'Client' as const, id: updateId }, // Инвалидируем конкретного клиента
        { type: 'Clients' as const, id: 'LIST' }, // Инвалидируем список клиентов
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
} = clientApi;

export default clientApi;
