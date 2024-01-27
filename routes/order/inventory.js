const router = require("express").Router();
const inventoryController = require("../../controller/order/InventoryController");

// Index Ingredients
router.get("/", inventoryController.inventory_index);

// Update Ingredient
router.put("/", inventoryController.inventory_put);

module.exports = router;
