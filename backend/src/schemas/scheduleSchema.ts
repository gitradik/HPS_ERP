import { gql } from 'apollo-server-express';

const scheduleSchema = gql`
  scalar DateTime

  enum ScheduleStatus {
    CLOSED
    OPEN
    PENDING
  }

  type Schedule {
    id: ID!
    title: String!
    allDay: Boolean!
    start: DateTime!
    end: DateTime!
    color: String!
    status: ScheduleStatus!
    staff: Staff! # Relation with staff
    client: Client! # Relation with client
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateScheduleInput {
    title: String!
    allDay: Boolean!
    start: DateTime!
    end: DateTime!
    color: String
    status: ScheduleStatus!
    staffId: ID!
    clientId: ID!
  }

  input UpdateScheduleInput {
    id: ID!
    title: String
    allDay: Boolean
    start: DateTime
    end: DateTime
    color: String
    status: ScheduleStatus
  }

  type Query {
    schedules: [Schedule!]!
    schedule(id: ID!): Schedule
    schedulesByStaffId(staffId: ID!): [Schedule!]!
    schedulesByClientIds(clientIds: [ID!]!): [Schedule!]!
  }

  type Mutation {
    createSchedule(input: CreateScheduleInput!): Schedule!
    updateSchedule(input: UpdateScheduleInput!): Schedule!
    deleteSchedule(id: ID!): Boolean!
  }
`;

export default scheduleSchema;
