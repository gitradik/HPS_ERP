import { mergeTypeDefs } from '@graphql-tools/merge';
import userSchema from './userSchema';
import clientSchema from './clientSchema';
import employeeSchema from './employeeSchema';
import staffSchema from './staffSchema';
import scheduleSchema from './scheduleSchema';
import scheduleOvertimeSchema from './scheduleOvertimeSchema';

const combinedSchema = mergeTypeDefs([
  userSchema,
  clientSchema,
  employeeSchema,
  staffSchema,
  scheduleSchema,
  scheduleOvertimeSchema,
]);

export default combinedSchema;
