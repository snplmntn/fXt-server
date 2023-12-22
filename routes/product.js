const router = require("express").Router();
const productController = require("../controller/ProductController");

// User Profile
router.get("/p", productController.product_get);

// User Profile
router.get("/", productController.product_index);

//Update User
router.post("/", productController.product_post);

module.exports = router;
