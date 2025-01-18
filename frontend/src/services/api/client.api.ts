import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { enhancedBaseQuery } from './baseQueryMiddleware';
import { ClientResponse } from 'src/types/client/client';

const clientApi = createApi({
  reducerPath: 'clientApi',
  baseQuery: enhancedBaseQuery,
  endpoints: (builder) => ({
    getClients: builder.query<{ clients: ClientResponse[] }, void>({
      query: () => ({
        document: gql`
          query GetClients {
            clients {
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
            }
          }
        `,
      }),
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
              }
            }
          }
        `,
        variables: { clientId },
      }),
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
              }
            }
          }
        `,
        variables: { userId },
      }),
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
} = clientApi;

export default clientApi;
