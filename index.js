// "use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");
const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const routes = require("./app/router/route");
const option = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "test api",
            version: "1.0.0",
            description: "test api with swagger"
        },
        servers: [{
            url: "http://localhost:3000"
        }],
    },
    apis: ['./app/router/*.js']
}

const specs = swaggerJsDoc(option);
app.use("/", swaggerUI.serve, swaggerUI.setup(specs));

app.use(bodyParser());
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "./app/views/"));
const port = process.env.PORT || 3000;
routes(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const creataModels = require("./app/models/createModels")
// creataModels();

app.listen(port, () => {
    console.log(`APP LISTENING ON PORT ${port}`)
})