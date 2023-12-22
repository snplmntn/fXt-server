const router = require("express").Router();
const voucherController = require("../../controller/order/VoucherController");

// Index Voucher
router.get("/", voucherController.voucher_index);

// Get Voucher
router.get("/v", voucherController.voucher_get);

// Create Voucher
router.post("/", voucherController.voucher_post);

module.exports = router;
