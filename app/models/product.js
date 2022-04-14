const Sequelize = require("sequelize");
const connectDB = require("./index");
const sequelize = connectDB();

const Product = sequelize.define("products", {
    product_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
        default: 0.0
    }
});

module.exports = { Product: Product };