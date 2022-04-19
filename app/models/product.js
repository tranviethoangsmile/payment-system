const Sequelize = require("sequelize");
const connectDB = require("./connectDB");
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
    },
}, {
    timestamps: false,
});

module.exports = { Product: Product };