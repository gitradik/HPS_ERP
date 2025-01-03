import { gql } from "apollo-server-express";

const documentSchema = gql`
  type Document {
    id: ID!
    type: String!
    employee: Employee
    createdBy: User!
    content: String!
    createdAt: String!
  }

  input CreateDocumentInput {
    type: String!
    employeeId: ID
    content: String!
  }

  type Query {
    documents(employeeId: ID): [Document!]!
    document(id: ID!): Document
  }

  type Mutation {
    createDocument(input: CreateDocumentInput!): Document!
    deleteDocument(id: ID!): Boolean!
  }
`;

export default documentSchema;
