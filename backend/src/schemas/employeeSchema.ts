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

    input UpdateEmployeeInput {
        isActive: Boolean
    }

    # Define the root Query type
    type Query {
        employees: [Employee!]! # Get all employees
        employee(id: ID!): Employee # Get employee by ID
        activeEmployees: [Employee!]! # Get all active employees
        employeeByUserId(userId: ID!): Employee # Get employee by userId
    }

    # Define the root Mutation type
    type Mutation {
        createEmployee(input: CreateEmployeeInput!): Employee! # Create an employee
        # updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee! # Update an employee
    }
`;

export default employeeSchema;
