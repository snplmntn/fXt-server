const router = require("express").Router();
const cartController = require("../../controller/order/CartController");

// Get products on Cart
router.get("/", cartController.cart_get);

// Add to Cart
router.post("/", cartController.cart_post);

module.exports = router;
