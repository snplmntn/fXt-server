const router = require("express").Router();
const reviewController = require("../../controller/order/ReviewController");

// Get Review/s
router.get("/", reviewController.review_get);

// Review
router.post("/", reviewController.review_post);

module.exports = router;
