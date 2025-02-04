import { gql } from 'apollo-server-express';

const userSchema = gql`
  enum UserRole {
    SUPER_ADMIN
    ADMIN
    MANAGER
    STAFF
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
    photo: String
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
    password: String
    role: UserRole
    isActive: Boolean
    position: String
    contactDetails: String
    photo: String
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String
    phoneNumber: String
    password: String!
    position: String
    role: UserRole
  }

  type UsersResponse {
    items: [User!]!
    totalCount: Int!
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
    user: User
  }

  type LogoutResponse {
    success: Boolean!
    message: String!
  }

  input UserQueryParams {
    filters: JSON
    sortOptions: [[String]]
    offset: Int
    limit: Int
  }

  # Define the root Query type
  type Query {
    users(queryParams: UserQueryParams): UsersResponse!
    user(id: ID!): User # Get user by ID
    usersByRole(role: UserRole!): [User!]!
    activeUsers: [User!]! # Получить активных пользователей
    usersByName(name: String!): [User!]! # Получить пользователей по имени
  }

  # Define the root Mutation type
  type Mutation {
    update(id: ID!, input: UpdateUserInput!): User! # Update a user
    delete(id: ID!): Boolean! # Delete a user
    register(input: RegisterInput!): RegisterResponse! # Register a new user
    login(email: String, phoneNumber: String, password: String!): LoginResponse!
    logout: LogoutResponse!
    refreshToken(refreshToken: String!): LoginResponse!
    verifyEmail(token: String!): LoginResponse!
  }
`;

export default userSchema;
