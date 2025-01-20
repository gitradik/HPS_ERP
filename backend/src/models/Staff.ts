// src/models/Staff.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../services/databaseService";
import User from "./User";

class Staff extends Model {
    public id!: number;
    public userId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public isAssigned!: boolean;
}

Staff.init(
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
        isAssigned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "staff",
        timestamps: true,
    }
);

Staff.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Staff;
