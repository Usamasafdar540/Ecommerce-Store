const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/user/userController");
const validator = require("../../../middlewares/tokenHandler/validateToken");
const adminHandler = require("../../../middlewares/roleHandler/roles");
router.post("/register", userController.createUser);
// router.post("/logout", userController.logoutUser);
router.post("/login", userController.loginUser);
router.get("/getallusers", validator, userController.getUsers);
router.get("/getuser/:id", validator, userController.getSingleUser);
// Check your route definition in your Express app
router.put("/updatepassword/:id", userController.UpdatePassword);
router.post("/forgotpassword", userController.forgotPassword);
router.post("/resetpassword", userController.resetPassword);
router.get("/wishlist", validator, userController.getWishlist);
router.post("/cart", validator, userController.userCart);
router.get("/getusercart", validator, userController.getUserCart);

router.delete("/emptycart/:id", validator, userController.emptyCart);

module.exports = router;
