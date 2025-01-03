import { mergeTypeDefs } from "@graphql-tools/merge";
import userSchema from "./userSchema";
import clientSchema from "./clientSchema";
import employeeSchema from "./employeeSchema";
import timeTrackingSchema from "./timeTrackingSchema";
import documentSchema from "./documentSchema";
import statisticsSchema from "./statisticsSchema";

const combinedSchema = mergeTypeDefs([
    userSchema,
    clientSchema,
    employeeSchema,
    // timeTrackingSchema,
    // documentSchema,
    // statisticsSchema,
]);

export default combinedSchema;
