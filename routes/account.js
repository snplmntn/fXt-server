const router = require("express").Router();
const accountController = require("../controller/AccountController");

// User Profiles
router.get("/i", accountController.user_index);

// User Profile
router.get("/", accountController.user_get);

//Update User
router.put("/", accountController.user_update);

module.exports = router;
