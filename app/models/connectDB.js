const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const dbConfig = process.env
connectDB = () => {
    return new Sequelize(dbConfig.DATABASE_NAME, dbConfig.DATABASE_USER, dbConfig.DATABASE_PASSWORD, {
        host: dbConfig.DATABASE_HOST,
        dialect: dbConfig.DATABASE_DIALECT
    });
}

module.exports = connectDB