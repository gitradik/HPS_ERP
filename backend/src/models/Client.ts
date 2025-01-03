// src/models/Client.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../services/databaseService";
import User from "./User";

class Client extends Model {
    public id!: number;
    public userId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Client.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id",
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "clients",
        timestamps: true,
    }
);

// Устанавливаем связь с моделью User
Client.belongsTo(User, { foreignKey: "userId" });

export default Client;
