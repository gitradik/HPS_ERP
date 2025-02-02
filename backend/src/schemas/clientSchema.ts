import { gql } from 'apollo-server-express';

const clientSchema = gql`
  enum ClientStatus {
    ACTIVE
    INACTIVE
    BLACKLIST
  }

  type Client {
    id: ID!
    userId: ID!
    createdAt: String!
    updatedAt: String!
    status: ClientStatus!
    user: User
    companyName: String
  }

  type ClientsResponse {
    items: [Client!]!
    totalCount: Int!
  }

  input CreateClientInput {
    userId: ID!
  }

  input UpdateClientInput {
    companyName: String
    status: ClientStatus
  }

  input ClientQueryParams {
    filters: JSON
    sortOptions: [[String]]
    offset: Int
    limit: Int
  }

  type Query {
    clients(queryParams: ClientQueryParams): ClientsResponse!
    client(id: ID!): Client
  }

  type Mutation {
    createClient(input: CreateClientInput!): Client!
    updateClient(id: ID!, input: UpdateClientInput!): Client!
  }

  scalar JSON
`;

export default clientSchema;
