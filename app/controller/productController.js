const Product = require("../models/product");
const connectDB = require("../models/index");
const sequelize = connectDB();
const product = Product.Product;
const redis = require("redis");
const { promisify } = require("util");
const axios = require("axios");
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient({
    host: '127.0.0.1',
    port: REDIS_PORT || 6379,
});

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

setResp = (id, data) => {
    return data;
};

const createLog = productWriteLogger("CREATE");
exports.create = (req, res) => {
    console.log(req.body);
    if (!req.body) {
        res.status(400).send({
            message: "product info can't empty!",
        });
        return;
    }
    const product_info = {
        product_name: req.body.product_name,
        price: req.body.price,
    };

    product
        .create(product_info)
        .then((data) => {
            res.send(data);
            createLog("created");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "can't save new product",
            });
        });
};

const findLog = productWriteLogger("FIND");
exports.findAll = (req, res) => {
    product
        .findAll()
        .then((data) => {
            res.status(200).send(data);
            findLog("find success");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
            findLog("find not success");
        });
};
// exports.findOne = async(req, res) => {
//     const id = req.params.tagId;
//     const respNow = await GET_ASYNC(id);
//     console.log(respNow);
//     if (respNow !== null) {
//         res.send(respNow);
//         return;
//     } else {
//         try {
//             product
//                 .findByPk(id)
//                 .then((data) => {
//                     if (data) {
//                         const saveValue = SET_ASYNC(id, data, EX, 5);
//                         console.log('set', saveValue)
//                         res.send(data);
//                         findLog("find success");
//                     } else {
//                         res.status(403).send({
//                             message: `Cannot find product with id=${id}.`,
//                         });
//                         findLog("find not success");
//                     }
//                 })

//         } catch (error) {
//             res.status(500).send({
//                 message: `error`,
//             });
//             findLog("find not success");
//         }
//     }

// };

exports.findOne = async(req, res, next) => {
    try {
        // const id = req.params.tagId
        // console.log('1')
        // const replyNow = await GET_ASYNC('rockets')
        // console.log('2')
        // if (replyNow) {
        //     console.log('using data saved cache');
        //     res.send(replyNow);
        //     return;
        // }

        const response = await axios.get('https://api.spacexdata.com/v3/capsules')
        console.log('1')
        const saveResult = await SET_ASYNC('capsules', JSON.stringify(response.data), 'EX', 5);
        console.log('save new data to cache ', saveResult);
        res.send(JSON.stringify(response.data));

    } catch (error) {
        res.send(error.message)
    }

}

// cache
const cache = productWriteLogger('CACHE')
exports.cache = async(req, res, next) => {
    next();
    const id = req.params.tagId;
    client.get(1, (err, result) => {
        cache('run')
        if (err) {
            cache('error', err)
            next()
        }
        if (result !== null) {
            console.log(result)
        }
    })
}

exports.findbyname = async(req, res) => {
    let data = req.body.name;
    const resData = await sequelize.query(
        `select * from products where product_name like '%${data}%'`, { raw: true }
    );
    if (!resData) {
        res.status(500).send({
            message: `data not found`,
        });
        findLog("find not success");
    } else {
        res.status(200).send(resData);
        findLog("find success");
    }
};

const updateLog = productWriteLogger("UPDATE");
exports.update = async(req, res) => {
    let { id, product_name, price } = req.body;
    console.log(id, product_name, price);
    if (id == undefined) {
        res.status(403).send({ message: "product info invalid" });
        updateLog("update not success");
    } else if (product_name == undefined && price != undefined) {
        const respData = await sequelize.query(
            `UPDATE products SET price = '${price}' WHERE id = '${id}'`
        );
        res.status(200).send({ message: "updated" });
        updateLog("update success");
    } else if (product_name != undefined && price == undefined) {
        const respData = await sequelize.query(
            `UPDATE products SET product_name = '${product_name}' WHERE id = '${id}'`
        );
        res.status(200).send({ message: "updated" });
        updateLog("update success");
    } else {
        const respData = await sequelize.query(
            `UPDATE products SET product_name = '${product_name}',price = '${price}' WHERE id = '${id}'`
        );
        res.status(200).send({ message: "updated" });
        updateLog("update success");
    }
};

const deleteLog = productWriteLogger("DELETE");
exports.delete = (req, res) => {
    const id = req.params.tagId;
    product
        .destroy({
            where: { id: id },
        })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: " deleted successfully!",
                });
                deleteLog("deleted");
            } else {
                res.send({
                    message: `Cannot delete Product with id=${id}`,
                });
                deleteLog("cannot delete");
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "fail",
            });
            deleteLog("delete fail");
        });
};

function productWriteLogger(namespace) {
    function logger(message) {
        console.log(`[${namespace}] : ${message}`);
    }

    return logger;
}