import userResolvers from './userResolvers';
import clientResolvers from './clientResolvers';
import employeeResolvers from './employeeResolvers';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...clientResolvers.Query,
    ...employeeResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...clientResolvers.Mutation,
    ...employeeResolvers.Mutation,
  },
};

export default resolvers;
