import { gql } from "apollo-server-express";

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

    input CreateClientInput {
        userId: ID!
    }

    input UpdateClientInput {
        companyName: String
        isWorking: Boolean
    }

    # Define the root Query type
    type Query {
        clients: [Client!]! # Get all clients
        client(id: ID!): Client # Get client by ID
    }

    # Define the root Mutation type
    type Mutation {
        createClient(input: CreateClientInput!): Client! # Create a client
        updateClient(id: ID!, input: UpdateClientInput!): Client! # Create a client
    }
`;

export default clientSchema;
