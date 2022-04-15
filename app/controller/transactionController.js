const Product_transactions = require('../models/product_transactions');
const connectDB = require('../models/index');
const sequelize = connectDB();
const transaction = Product_transactions.ProductTransaction

const { createClient } = require("redis");

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));


(async() => {
    await client.connect();
})();

exports.create = async(req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "data can not be empty!"
        });
        return;
    }
    const customer_buy = {
        user_name: req.body.user_name,
        product_id: req.body.product_id,
        price: req.body.price,
    }
    if (customer_buy.user_name == null || customer_buy.product_id == null || customer_buy.price == null) {
        res.status(400).send({
            message: "data can not be empty!"
        });
        return;
    }
    const result = await sequelize.query(`
    CALL bill_save('${customer_buy.user_name}',${customer_buy.product_id}, ${customer_buy.price})
    `)
    res.status(200).send({
        message: "success"
    });

};

exports.findByIdCustomer = async(req, res) => {
    let id = req.params.tagId
    const resData = await sequelize.query(`select * from product_transactions where user_id = '${id}'`);
    if (!resData) {
        res.status(500).send({
            message: `data not found`
        });
    } else {
        const setStatus = await client.set(id, resData)
        console.log('set >> ', setStatus);
        res.status(200).send(resData);
    }
}

exports.cache = async(req, res, next) => {
    const id = req.params.tagId;
    const reply = await client.get(id);
    console.log('transaction rep', reply);
    if (reply !== null) {
        res.send(reply)
        console.log('transaction sended');
        return;
    } else {
        next();
    }
}