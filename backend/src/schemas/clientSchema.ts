import { gql } from 'apollo-server-express';

const clientSchema = gql`
  type Client {
  id: ID!
  userId: ID!
  createdAt: String!
  updatedAt: String!
  user: User
  companyName: String
  isWorking: Boolean!
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
  isWorking: Boolean
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
