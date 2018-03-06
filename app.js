const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", require("./routes/index"));
app.use("/products", require("./routes/products"));

app.listen(5000, function () {
    console.log('Retail app is up and running on port 5000');
})