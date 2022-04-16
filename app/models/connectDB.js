const Sequelize = require('sequelize');
connectDB = () => {
    return new Sequelize('payment_system', 'root', '29061993', {
        host: 'localhost',
        dialect: 'mysql'
    });
}

module.exports = connectDB