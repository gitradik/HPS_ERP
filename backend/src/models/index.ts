import sequelize from "../services/databaseService";
import User from "./User";
import Client from "./Client";
import Employee from "./Employee";

const models = {
    User,
    Client,
    Employee,
};

export { sequelize, models };
