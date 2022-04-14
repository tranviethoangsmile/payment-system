// "use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");
const app = express();
app.use(bodyParser());
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "./app/views/"));
const routes = require("./app/router/route");
const port = process.env.PORT || 3000;
routes(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const creataModels = require("./app/models/createModels")
creataModels();
app.listen(port, () => {
    console.log(`APP LISTENING ON PORT ${port}`)
})