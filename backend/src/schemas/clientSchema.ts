import { gql } from "apollo-server-express";

const clientSchema = gql`
    type Client {
        id: ID!
        userId: ID!
        createdAt: String!
        updatedAt: String!
        user: User!
    }

    input CreateClientInput {
        userId: ID!
    }

    # Define the root Query type
    type Query {
        clients: [Client!]! # Get all clients
        client(id: ID!): Client # Get client by ID
    }

    # Define the root Mutation type
    type Mutation {
        createClient(input: CreateClientInput!): Client! # Create a client
    }
`;

export default clientSchema;
