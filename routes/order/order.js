const router = require("express").Router();
const orderController = require("../../controller/order/OrderController");

// Index Orders
router.get("/", orderController.order_index);

// Get Order/s
router.get("/o", orderController.order_get);

// MC Order
router.post("/", orderController.order_post);

// Update Order
router.put("/", orderController.order_put);

module.exports = router;
