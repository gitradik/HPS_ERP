import { gql } from 'apollo-server-express';

const staffSchema = gql`
  type Staff {
    id: ID!
    userId: ID!
    createdAt: String!
    updatedAt: String!
    user: User!
    isAssigned: Boolean!
  }

  input CreateStaffInput {
    userId: ID!
  }

  input UpdateStaffInput {
    userId: ID!
    isAssigned: Boolean
  }

  type Query {
    staffs: [Staff!]!
    staff(id: ID!): Staff
  }

  type Mutation {
    createStaff(input: CreateStaffInput!): Staff!
    updateStaff(input: UpdateStaffInput!): Staff!
  }
`;

export default staffSchema;
