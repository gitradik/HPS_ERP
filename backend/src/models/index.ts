import sequelize from "../services/databaseService";
import User from "./User";
import Client from "./Client";
import Employee from "./Employee";
import RefreshToken from "./RefreshToken";
import Staff from "./Staff";

const models = {
    User,
    Client,
    Employee,
    RefreshToken,
    Staff,
};

export { sequelize, models };
