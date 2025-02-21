import { gql } from 'apollo-server-express';

const staffSchema = gql`
  scalar DateTime
  type Staff {
    id: ID!
    userId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    isAssigned: Boolean!
  }

  type StaffsResponse {
    items: [Staff!]!
    totalCount: Int!
  }

  input CreateStaffInput {
    userId: ID!
  }

  input UpdateStaffInput {
    userId: ID!
    isAssigned: Boolean
  }

  input StaffQueryParams {
    filters: JSON
    sortOptions: [[String]]
    offset: Int
    limit: Int
  }

  type Query {
    staffs(queryParams: StaffQueryParams): StaffsResponse!
    staff(id: ID!): Staff
  }

  type Mutation {
    createStaff(input: CreateStaffInput!): Staff!
    updateStaff(input: UpdateStaffInput!): Staff!
  }

  scalar JSON
`;

export default staffSchema;
