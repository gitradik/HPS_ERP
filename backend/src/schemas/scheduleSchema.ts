import { gql } from 'apollo-server-express';

const scheduleSchema = gql`
  enum ScheduleStatus {
    CLOSED
    OPEN
    PENDING
  }

  type Schedule {
    id: ID!
    title: String!
    allDay: Boolean!
    start: String!
    end: String!
    color: String!
    status: ScheduleStatus!
    staff: Staff! # Relation with staff
    client: Client! # Relation with client
    createdAt: String!
    updatedAt: String!
  }

  input CreateScheduleInput {
    title: String!
    allDay: Boolean!
    start: String!
    end: String!
    color: String
    status: ScheduleStatus!
    staffId: ID!
    clientId: ID!
  }

  input UpdateScheduleInput {
    id: ID!
    title: String
    allDay: Boolean
    start: String
    end: String
    color: String
    status: ScheduleStatus
  }

  type Query {
    schedules: [Schedule!]!
    schedule(id: ID!): Schedule
    schedulesByStaffId(staffId: ID!): [Schedule!]!
    schedulesByStaffIds(staffIds: [ID!]!): [Schedule!]!
  }

  type Mutation {
    createSchedule(input: CreateScheduleInput!): Schedule!
    updateSchedule(input: UpdateScheduleInput!): Schedule!
    deleteSchedule(id: ID!): Boolean!
  }
`;

export default scheduleSchema;
