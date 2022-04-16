const Sequelize = require('sequelize');
const connectDB = require('./connectDB');
const sequelize = connectDB();

const User = sequelize.define('users', {
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }

});

module.exports = { User: User };