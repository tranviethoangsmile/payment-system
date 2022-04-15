const ProductConller = require('../controller/productController');
const TransactionController = require('../controller/transactionController');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 5000;
const client = redis.createClient(REDIS_PORT);
routes = (app) => {
    app.get('/', (req, res) => {
        res.render('system');
    });
    // get all product 
    app.get('/api/product/getall', ProductConller.findAll);
    // get product by id
    app.get('/api/product/:tagId', ProductConller.findOne);
    // create new product
    app.post('/api/product/create', ProductConller.create);

    app.patch('/api/product/update', ProductConller.update);
    app.get('/api/product/delete/:tagId', ProductConller.delete);
    app.post('/api/product/search', ProductConller.findbyname);
    app.post('/api/transaction/create', TransactionController.create)
    app.get('/api/transaction/:tagId', TransactionController.findByIdCustomer);

}

module.exports = routes;