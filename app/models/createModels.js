// don't use
const Sequelize = require('sequelize');
const connectDB = require('./connectDB');
const sequelize = connectDB();
const User = require("./user");
const Product = require("./product");
const Product_transactions = require("./product_transactions");
createModels = () => {
    Product.Product.sync().then(() => {
        console.log('created Product table')
    }).catch(err => {
        console.log('create Product table error: ' + err.message)
    });
    User.User.sync().then(() => {
        console.log('created user table')
    }).catch(err => {
        console.log('create user table error: ' + err.message)
    });
    Product_transactions.ProductTransaction.sync().then(() => {
        console.log('created ProductTransaction table')
    }).catch(err => {
        console.log('create ProductTransaction table error: ' + err.message)
    });
}
module.exports = createModels;