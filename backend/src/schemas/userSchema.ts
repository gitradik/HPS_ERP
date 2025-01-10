import { gql } from "apollo-server-express";

const userSchema = gql`
    enum UserRole {
        SUPER_ADMIN
        ADMIN
        MANAGER
        EMPLOYEE
        CLIENT
        USER
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String
        phoneNumber: String
        isActive: Boolean!
        createdAt: String!
        updatedAt: String!
        role: UserRole
        position: String
        contactDetails: String
    }

    input CreateUserInput {
        firstName: String!
        lastName: String!
        email: String
        phoneNumber: String
        password: String!
        role: UserRole
        position: String
        contactDetails: String
    }

    input UpdateUserInput {
        firstName: String
        lastName: String
        email: String
        phoneNumber: String
        role: UserRole
        isActive: Boolean
        position: String
        contactDetails: String
    }

    input RegisterInput {
        firstName: String!
        lastName: String!
        email: String
        phoneNumber: String
        password: String!
    }

    type RegisterResponse {
        success: Boolean!
        message: String!
        user: User
    }

    type LoginResponse {
        success: Boolean!
        message: String!
        accessToken: String
        refreshToken: String
    }

    # Define the root Query type
    type Query {
        users: [User!]! # Get all users
        user(id: ID!): User # Get user by ID
        usersByRole(role: UserRole!): [User!]!
        activeUsers: [User!]! # Получить активных пользователей
        usersByName(name: String!): [User!]! # Получить пользователей по имени
    }

    # Define the root Mutation type
    type Mutation {
        createUser(input: CreateUserInput!): User! # Create a user
        updateUser(id: ID!, input: UpdateUserInput!): User! # Update a user
        deleteUser(id: ID!): Boolean! # Delete a user
        registerUser(input: RegisterInput!): RegisterResponse! # Register a new user
        login(email: String, phoneNumber: String, password: String!): LoginResponse!
        logout: Boolean!
        refreshToken(refreshToken: String!): LoginResponse!
    }
`;

export default userSchema;
