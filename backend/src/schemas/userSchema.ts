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
    email: String!
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
    email: String!
    password: String!
    role: UserRole
    position: String
    contactDetails: String
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    role: UserRole
    isActive: Boolean
    position: String
    contactDetails: String
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
  }
`;

export default userSchema;
