import { Sequelize } from "sequelize";

const db = new Sequelize('tracking_pkl', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;