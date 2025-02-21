import dateScalar from './scalars/dateScalar';

import userResolvers from './userResolvers';
import clientResolvers from './clientResolvers';
import employeeResolvers from './employeeResolvers';
import staffResolvers from './staffResolvers';
import scheduleResolvers from './scheduleResolvers';
import scheduleOvertimeResolvers from './scheduleOvertimeResolvers';

const resolvers = {
  DateTime: dateScalar,
  Query: {
    ...userResolvers.Query,
    ...clientResolvers.Query,
    ...employeeResolvers.Query,
    ...staffResolvers.Query,
    ...scheduleResolvers.Query,
    ...scheduleOvertimeResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...clientResolvers.Mutation,
    ...employeeResolvers.Mutation,
    ...staffResolvers.Mutation,
    ...scheduleResolvers.Mutation,
    ...scheduleOvertimeResolvers.Mutation,
  },
};

export default resolvers;
