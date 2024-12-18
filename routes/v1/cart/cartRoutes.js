const express = require("express");
const router = express.Router();
const cartController = require("../../../controllers/cart/cartController");
const validator = require("../../../middlewares/tokenHandler/validateToken");
const adminHandler = require("../../../middlewares/roleHandler/roles");

router.get("/wishlist", validator, cartController.getWishlist);
router.get("/getusercart", validator, cartController.getUserCart);
router.post("/cart", validator, cartController.userCart);
router.delete("/emptycart", validator, cartController.emptyCart);

module.exports = router;
