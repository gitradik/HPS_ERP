import { gql } from "apollo-server-express";

const employeeSchema = gql`
    type Employee {
        id: ID!
        userId: ID!
        createdAt: String!
        updatedAt: String!
        user: User!
    }

    input CreateEmployeeInput {
        userId: ID!
    }

    # Define the root Query type
    type Query {
        employees: [Employee!]! # Get all employees
        employee(id: ID!): Employee # Get employee by ID
    }

    # Define the root Mutation type
    type Mutation {
        createEmployee(input: CreateEmployeeInput!): Employee! # Create an employee
    }
`;

export default employeeSchema;
