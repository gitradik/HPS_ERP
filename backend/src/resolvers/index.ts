import userResolvers from './userResolvers';
import clientResolvers from './clientResolvers';
import employeeResolvers from './employeeResolvers';
import staffResolvers from './staffResolvers';
import scheduleResolvers from './scheduleResolvers';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...clientResolvers.Query,
    ...employeeResolvers.Query,
    ...staffResolvers.Query,
    ...scheduleResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...clientResolvers.Mutation,
    ...employeeResolvers.Mutation,
    ...staffResolvers.Mutation,
    ...scheduleResolvers.Mutation,
  },
};

export default resolvers;
