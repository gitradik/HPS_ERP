import { gql } from 'apollo-server-express';

const scheduleOvertimeSchema = gql`
  scalar DateTime

  enum OvertimeType {
    HOLIDAY
    WEEKEND
    OVERTIME
  }

  type ScheduleOvertime {
    id: ID!
    schedule: Schedule!
    date: DateTime!
    hours: Int!
    type: OvertimeType!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateScheduleOvertimeInput {
    scheduleId: ID!
    date: DateTime!
    hours: Int!
    type: OvertimeType!
  }

  input UpdateScheduleOvertimeInput {
    id: ID!
    date: DateTime!
    hours: Int!
    type: OvertimeType!
  }

  type Query {
    scheduleOvertimes: [ScheduleOvertime!]!
    scheduleOvertime(id: ID!): ScheduleOvertime
    scheduleOvertimesByScheduleId(scheduleId: ID!): [ScheduleOvertime!]!
  }

  type Mutation {
    createScheduleOvertime(input: CreateScheduleOvertimeInput!): ScheduleOvertime!
    updateScheduleOvertime(input: UpdateScheduleOvertimeInput!): ScheduleOvertime!
    deleteScheduleOvertime(id: ID!): Boolean!
  }
`;

export default scheduleOvertimeSchema;
