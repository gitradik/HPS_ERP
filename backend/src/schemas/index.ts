import { mergeTypeDefs } from "@graphql-tools/merge";
import userSchema from "./userSchema";
import clientSchema from "./clientSchema";
import employeeSchema from "./employeeSchema";

const combinedSchema = mergeTypeDefs([
    userSchema,
    clientSchema,
    employeeSchema,
]);

export default combinedSchema;
