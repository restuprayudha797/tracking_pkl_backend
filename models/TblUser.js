import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Role_user from "./TblRoleUser.js";
const { DataTypes } = Sequelize;

const Users = db.define('tbl_user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_user: {
        type: DataTypes.INTEGER,
        references: {
            model: Role_user,
            key: 'role_id'
        }
    },
    user_name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.TEXT
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
});

Users.belongsTo(Role_user, { foreignKey: 'role_user' });

export default Users;
