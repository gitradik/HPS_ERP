import { gql } from "apollo-server-express";

const timeTrackingSchema = gql`
    type WorkTime {
        id: ID!
        employee: Employee! # Связь с Employee
        date: String!
        hoursWorked: Float!
        overtimeHours: Float
        createdBy: User! # Кто добавил запись (связь с User)
        createdAt: String!
    }

    input LogWorkTimeInput {
        employeeId: ID!
        date: String!
        hoursWorked: Float!
        overtimeHours: Float
    }

    type Query {
        workTimes(employeeId: ID!): [WorkTime!]!
    }

    type Mutation {
        logWorkTime(input: LogWorkTimeInput!): WorkTime!
        updateWorkTime(
            id: ID!
            hoursWorked: Float
            overtimeHours: Float
        ): WorkTime!
    }
`;

export default timeTrackingSchema;
