import { gql } from 'apollo-server-express';

const employeeSchema = gql`
  type Employee {
    id: ID!
    userId: ID!
    createdAt: String!
    updatedAt: String!
    user: User!
  }

  type EmployeesResponse {
    items: [Employee!]!
    totalCount: Int!
  }

  input CreateEmployeeInput {
    userId: ID!
  }

  input EmployeeQueryParams {
    filters: JSON
    sortOptions: [[String]]
    offset: Int
    limit: Int
  }

  # Define the root Query type
  type Query {
    employees(queryParams: EmployeeQueryParams): EmployeesResponse!
    employee(id: ID!): Employee # Get employee by ID
  }

  # Define the root Mutation type
  type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee! # Create an employee
  }

  scalar JSON
`;

export default employeeSchema;
