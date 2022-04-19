const Product_transactions = require('../models/product_transactions');
const User = require('../models/user');
const Product = require("../models/product");
const connectDB = require('../models/connectDB');
const sequelize = connectDB();
const transaction = Product_transactions.ProductTransaction
const user = User.User;
const product = Product.Product;

const { createClient } = require("redis");

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));


// IIFE
(async() => {
    await client.connect();
})();


// create
const logCreate = logTransaction('CREATE')
exports.create = async(req, res) => {
    if (!req.body) {
        logCreate('DATA FAIL')
        res.status(400).send({
            message: "data can not be empty!"
        });
        return;
    }

    // get data from client request
    const customer_buy = {
        user_id: req.body.user_id,
        product_id: req.body.product_id,
        price: req.body.price,
    }

    // // check login
    // if (customer_buy.user_id == null) {
    //     logCreate('USER_ID EMPTY!')
    //     res.status(400).send({
    //         message: "please login!"
    //     });
    //     return;
    // }

    // check null data request
    // if (customer_buy.product_id == null || customer_buy.price == null) {
    //     logCreate('PRODUCT_ID OR PRICE EMPTY')
    //     res.status(400).send({
    //         message: "data can not be empty!"
    //     });
    //     return;
    // }

    // check user in database exist
    const user_value = await user.findByPk(customer_buy.user_id);
    if (!user_value) {
        logCreate('USER_ID NOT EXISTS')
        res.status(400).send({
            message: "please sign up account!"
        });
        return;
    }

    // check product in database exist avoid the case that the product price has been deleted
    const product_value = await product.findByPk(customer_buy.product_id);
    if (!product_value) {
        logCreate('PRODUCT NOT EXISTS')
        res.status(400).send({
            message: "product not exist. sorry!"
        });
        return;
        // againt check price in database avoid the case that the product product has been changed
    } else if (product_value.price != customer_buy.price) {
        logCreate('PRICE CHANGED')
        res.status(400).send({
            message: "price of product changed. Please update page!"
        });
        return;
    }

    // create bill 
    const bill = await transaction.create(customer_buy)
    if (!bill) {
        logCreate('CREATE FAILED!')
        res.status(400).send({
            message: "failed"
        });
        return;
    } else {
        logCreate('CREATE SUCCESS!')
        res.status(200).send({ message: 'created' });
        return;
    }
};


// find list of user
const logFind = logTransaction('FIND')
exports.findByIdUser = async(req, res) => {
    let id = req.params.tagId
    const resData = await transaction.findAll({ where: { user_id: id } })
    if (resData < 1) {
        logFind('DATA NOT EXISTS')
        res.status(500).send({
            message: `data not found`
        });
    } else {
        const setStatus = await client.set(`user_${id}`, JSON.stringify(resData))
        console.log('set cache: ', setStatus);
        res.status(200).send(resData);
        logFind('FIND DATA SUCCESS!')
        return;
    }
}


// cache
exports.cache = async(req, res, next) => {
    const id = req.params.tagId;
    const reply = await client.get(`user_${id}`);
    console.log('transaction reply client');
    if (reply !== null) {
        res.send(reply)
        console.log('transaction sended');
        return;
    } else {
        next();
    }
}


// log
function logTransaction(namespace) {
    function logger(message) {
        console.log(`[${namespace}]: ${message}`)
    }
    return logger;
}