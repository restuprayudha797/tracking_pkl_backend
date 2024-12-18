import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Role_user = db.define('tbl_role_user', {  // Ganti nama tabel jadi 'roles'
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: {
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true
});

export default Role_user;
