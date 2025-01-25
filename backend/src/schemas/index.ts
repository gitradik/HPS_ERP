import { mergeTypeDefs } from '@graphql-tools/merge';
import userSchema from './userSchema';
import clientSchema from './clientSchema';
import employeeSchema from './employeeSchema';
import staffSchema from './staffSchema';
import scheduleSchema from './scheduleSchema';

const combinedSchema = mergeTypeDefs([
  userSchema,
  clientSchema,
  employeeSchema,
  staffSchema,
  scheduleSchema,
]);

export default combinedSchema;
