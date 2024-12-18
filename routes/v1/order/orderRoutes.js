const express = require("express");
const router = express.Router();
const orderController = require("../../../controllers/order/orderController");
const validator = require("../../../middlewares/tokenHandler/validateToken");
const adminHandler = require("../../../middlewares/roleHandler/roles");
router.post("/createorder", orderController.createOrder);
router.get("/getallorders", orderController.getAllOrders);
router.get("/getuserorder", validator, orderController.getOrderByUserId);
router.get("/getanorder/:id", validator, orderController.getOrders);
router.put("/updateorderstatus/:id", orderController.updateOrderStatus);

module.exports = router;
