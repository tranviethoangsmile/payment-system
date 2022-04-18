const Product = require("../models/product");
const connectDB = require("../models/connectDB");
const Sequelize = require('sequelize');
const sequelize = connectDB();
const product = Product.Product;
const { createClient } = require("redis");
const Op = Sequelize.Op;

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));




// IIFE 
(async() => {
    await client.connect();
})();



// create new product
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
    if (product_info.product_name == null || product_info.price == null) {
        res.status(400).send({
            message: "product info can't empty!",
        });
        return;
    }

    product
        .create(product_info)
        .then((data) => {
            client.del('getall')
            res.status(200).send(data);
            createLog("created");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "can't save new product",
            });
        });
};


// find All product
const findLog = productWriteLogger("FIND");
exports.findAll = async(req, res) => {
    const dataRep = await client.get(req.params.getall);
    if (dataRep != null) {
        findLog("CACHE REPLY")
        res.status(200).send(dataRep);
        return;
    }
    product
        .findAll()
        .then(async(data) => {
            const setAllProduct = await client.set('getall', JSON.stringify(data));
            findLog("set values all product : " + setAllProduct);
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



// handle find product by id
exports.findOne = async(req, res) => {
    const id = req.params.tagId;
    try {
        product
            .findByPk(id)
            .then(async(data) => {
                findLog("RUN")
                const saveValue = await client.set(id, JSON.stringify(data));
                findLog("set data to cache " + saveValue)
                res.status(200).send(data);
                findLog("find success");
            })
    } catch (error) {
        res.status(500).send({
            message: `error`,
        });
        findLog("find not success");
    }
};




// handle find product by name like %...%
exports.findbyname = async(req, res) => {
    let data = req.body.product_name;
    const resData = await product.findAll({
        where: {
            product_name: {
                [Op.like]: `%${data}%`
            },
        },
        raw: true,
    })
    if (resData.length < 1) {
        res.status(500).send({
            message: `data not found`,
        });
        findLog("find not success");
    } else {
        res.status(200).send(JSON.stringify(resData));
        findLog("find success");
    }
};


// handle update product
const updateLog = productWriteLogger("UPDATE");
exports.update = async(req, res) => {
    let { id, product_name, price } = req.body;
    console.log(id, product_name, price);
    if (id == undefined) {
        res.status(403).send({ message: "product info invalid" });
        updateLog("update not success");
    } else if (product_name == undefined && price != undefined) {
        const respData = await product.update({ price: price }, { where: { id: id } });
        client.del('getall');
        res.status(200).send({ message: "updated" });
        updateLog("update success");
    } else if (product_name != undefined && price == undefined) {
        const respData = await product.update({ product_name: product_name }, { where: { id: id } });
        client.del('getall');
        res.status(200).send({ message: "updated" });
        updateLog("update success");
    } else {
        const respData = await product.update({ product_name: product_name, price: price }, { where: { id: id } });
        client.del('getall');
        res.status(200).send({ message: "updated" });
        updateLog("update success");
    }
};


// handle delete product
const deleteLog = productWriteLogger("DELETE");
exports.delete = (req, res) => {
    const id = req.params.tagId;
    product
        .destroy({
            where: { id: id },
        })
        .then((num) => {
            if (num == 1) {
                client.del('getall');
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
            console.log(err)
            res.status(500).send({
                message: "fail",
            });
            deleteLog("delete fail");
        });
};

// cache
const cache = productWriteLogger('CACHE')
exports.cache = async(req, res, next) => {
    const id = req.params.tagId;
    const reply = await client.get(id);
    cache('get data ok ')
    if (reply !== null) {
        res.send(reply)
        cache('cache sended')
        return;
    } else {
        next();
    }
}


// Closures write log system
function productWriteLogger(namespace) {
    function logger(message) {
        console.log(`[${namespace}] : ${message}`);
    }
    return logger;
}