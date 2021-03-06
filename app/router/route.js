const ProductConller = require("../controller/productController");
const TransactionController = require("../controller/transactionController");
const redis = require("redis");
const REDIS_PORT = process.env.REDIS_PORT || 5000;
const client = redis.createClient(REDIS_PORT);
/**
 * @swagger
 * components:
 *   schemas:
 *      product:
 *        type: object
 *        required:
 *        properties:
 *              id:
 *                  type: interger
 *                  description: the auto generated id
 *              name:
 *                  type: string
 *                  description: max length is 255 characters
 *              price:
 *                  type: float
 *                  description: not null
 *        example:
 *         name: iphone 11
 *         price: 1000
 *
 */
routes = (app) => {
    // app.get('/', (req, res) => {
    //     res.render('system');
    // });
    // get all product
    app.get("/api/product/getall", ProductConller.findAll);
    // get product by id
    app.get("/api/product/:tagId", ProductConller.cache, ProductConller.findOne);
    // create new product
    app.post("/api/product/create", ProductConller.create);
    // update produce
    app.patch("/api/product/update", ProductConller.update);
    // delete product
    app.get("/api/product/delete/:tagId", ProductConller.delete);
    // search product
    app.post("/api/product/search", ProductConller.findbyname);
    // create bill
    app.post("/api/transaction/create", TransactionController.create);
    // get list of user
    app.get(
        "/api/transaction/:tagId",
        TransactionController.cache,
        TransactionController.findByIdUser
    );
};

module.exports = routes;