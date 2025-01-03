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

    input UpdateClientInput {
        isActive: Boolean
    }

    # Define the root Query type
    type Query {
        clients: [Client!]! # Get all clients
        client(id: ID!): Client # Get client by ID
        activeClients: [Client!]! # Get all active clients
        clientByUserId(userId: ID!): Client # Get client by userId
    }

    # Define the root Mutation type
    type Mutation {
        createClient(input: CreateClientInput!): Client! # Create a client
        # updateClient(id: ID!, input: UpdateClientInput!): Client! # Update a client
        deleteClient(id: ID!): Boolean! # Delete a client
    }
`;

export default clientSchema;
