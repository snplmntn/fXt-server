const router = require("express").Router();
const reviewController = require("../../controller/order/ReviewController");

// Review
router.post("/", reviewController.review_post);

module.exports = router;
