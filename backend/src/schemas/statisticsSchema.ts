import { gql } from "apollo-server-express";

const statisticsSchema = gql`
  type Statistics {
    id: ID!
    type: String!
    data: JSON
    generatedBy: User! # Кто сгенерировал статистику
    createdAt: String!
  }

  type Query {
    getStatistics(type: String!): Statistics!
  }
`;

export default statisticsSchema;
