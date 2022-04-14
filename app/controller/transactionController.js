const Product_transactions = require('../models/product_transactions');
const connectDB = require('../models/index');
const sequelize = connectDB();
const transaction = Product_transactions.ProductTransaction


exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "data can not be empty!"
        });
        return;
    }
    const sell_info = {
        user_id: req.body.user_id,
        product_id: req.body.product_id,
        price: req.body.price
    };
    console.log(sell_info);
    transaction.create(sell_info)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "can't save new product"
            });
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
        res.status(200).send(resData);
    }
}