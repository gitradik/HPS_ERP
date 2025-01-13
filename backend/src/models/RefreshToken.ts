// models/RefreshToken.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../services/databaseService";
import User from "./User";

class RefreshToken extends Model {
    public id!: number;
    public userId!: number;
    public token!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

RefreshToken.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id",
            },
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "RefreshToken",
    }
);

RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

export default RefreshToken;
