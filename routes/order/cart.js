const router = require("express").Router();
const cartController = require("../../controller/order/CartController");

// Get products on Cart
router.get("/", cartController.cart_get);

// Add to Cart
router.post("/", cartController.cart_post);

// Remove from Cart
router.delete("/", cartController.cart_delete);

module.exports = router;
