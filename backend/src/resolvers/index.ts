import userResolvers from './userResolvers';
import clientResolvers from './clientResolvers';
import employeeResolvers from './employeeResolvers';
import staffResolvers from './staffResolvers';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...clientResolvers.Query,
    ...employeeResolvers.Query,
    ...staffResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...clientResolvers.Mutation,
    ...employeeResolvers.Mutation,
    ...staffResolvers.Mutation,
  },
};

export default resolvers;
