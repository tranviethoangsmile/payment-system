const Sequelize = require('sequelize');
const connectDB = require('./connectDB');
const sequelize = connectDB();
const User = require('./user');
const Product = require('./product')

const ProductTransaction = sequelize.define('product_transactions', {
    price: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
        default: 0.0
    },
    user_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: User.User,
            key: 'id'
        }
    },
    product_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: Product.Product,
            key: 'id'
        }
    },
});

module.exports = { ProductTransaction: ProductTransaction };