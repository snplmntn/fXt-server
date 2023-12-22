const router = require("express").Router();
const authController = require("../controller/AuthController");

// SIGNUP
router.post("/signup", authController.user_signup);

// LOGIN
router.post("/login", authController.user_login);

// // LOGOUT
// router.post("/logout", authController.InvalidateToken);

module.exports = router;
