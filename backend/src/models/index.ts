import sequelize from "../services/databaseService";
import User from "./User";
import Client from "./Client";
import Employee from "./Employee";
import RefreshToken from "./RefreshToken";

const models = {
    User,
    Client,
    Employee,
    RefreshToken,
};

export { sequelize, models };
