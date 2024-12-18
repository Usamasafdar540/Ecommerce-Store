const express = require("express");
const router = express.Router();
const validator = require("../../../middlewares/tokenHandler/validateToken");
const adminHandler = require("../../../middlewares/roleHandler/roles");
const couponController = require("../../../controllers/coupon/couponController");
router.post("/createcoupon", couponController.createCoupon);
router.post("/applycoupon", validator, couponController.applyCoupon);
router.get("/getcoupon/:id", couponController.getSingleCoupon);
router.get("/getallcoupons", couponController.getAllCoupons);
router.put("/updatecoupon/:id", couponController.updateCoupon);
router.delete("/deletecoupon/:id", couponController.deleteCoupon);

module.exports = router;
