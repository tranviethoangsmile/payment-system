const Product = require("../models/product");
const connectDB = require("../models/index");
const sequelize = connectDB();
const product = Product.Product;
const { createClient } = require("redis");

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));


(async() => {
    await client.connect();
})();

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
    if (product_info.product_name == null || product_info.price == null) {
        res.status(400).send({
            message: "product info can't empty!",
        });
        return;
    }

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

exports.findOne = async(req, res) => {
    const id = req.params.tagId;
    try {
        product
            .findByPk(id)
            .then(async(data) => {
                findLog("run")
                const saveValue = await client.set(id, JSON.stringify(data));
                findLog("set data to cache " + saveValue)
                res.send(data);
                findLog("find success");
            })
    } catch (error) {
        res.status(500).send({
            message: `error`,
        });
        findLog("find not success");
    }
};



// cache
const cache = productWriteLogger('CACHE')
exports.cache = async(req, res, next) => {
    const id = req.params.tagId;
    const reply = await client.get(id);
    cache('get data ok ')
    if (reply !== null) {
        res.send(reply)
        cache('sended')
        return;
    } else {
        next();
    }
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