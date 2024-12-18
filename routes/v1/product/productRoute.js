const express = require("express");
const router = express.Router();
const validator = require("../../../middlewares/tokenHandler/validateToken");
const fileUploader = require("../../../middlewares/fileupload/fileUpload");
const adminHandler = require("../../../middlewares/roleHandler/roles");
const productController = require("../../../controllers/products/productController");

router.post("/createproduct", fileUploader, productController.createProduct);
router.get("/getproduct/:id", productController.getProduct);
router.get("/getallproducts", productController.getAllProducts);
router.patch("/updateproduct/:id", productController.updateProduct);
router.delete("/deletproduct/:id", productController.deleteProduct);
router.put("/addtowishlist", validator, productController.addToWishlist);

router.delete(
  "/removefromwishlist/:productId",
  validator,
  productController.removeFromWishlist
);
router.put("/addratings", validator, productController.rating);
router.put("/getallratings", validator, productController.rating);

module.exports = router;
