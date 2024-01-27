const express = require("express");
const cors = require("cors");

const app = express();
const port = 1234;

//Middlewares
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log("listening");
});

//Routes
//Account
const authRoute = require("./routes/auth");
const accountRoute = require("./routes/account");

//Product
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order/order");
const inventoryRoute = require("./routes/order/inventory");
const reviewRoute = require("./routes/order/review");
const cartRoute = require("./routes/order/cart");
const voucherRoute = require("./routes/order/voucher");
const aliveRoute = require("./routes/alive");

app.use("/api/auth", authRoute);
app.use("/api/account", accountRoute);

app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/review", reviewRoute);
app.use("/api/cart", cartRoute);
app.use("/api/voucher", voucherRoute);

app.use("/api/alive", aliveRoute);
