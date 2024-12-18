const express = require("express");
const router = express.Router();
const categoryController = require("../../../controllers/category/productCategoryController");
const validator = require("../../../middlewares/tokenHandler/validateToken");
const adminHandler = require("../../../middlewares/roleHandler/roles");
router.post(
  "/createcategory",
  validator,
  adminHandler,
  categoryController.createCategory
);
router.get(
  "/singlepcategory/:id",
  // validator,
  // adminHandler,
  categoryController.getaProductsCat
);
router.get(
  "/allproductcategory",
  // validator,
  // adminHandler,
  categoryController.getProductsCat
);
router.put(
  "/updateproductcategory/:id",
  // validator,
  // adminHandler,
  categoryController.updatePCategory
);
router.delete(
  "/deleteproductcategory/:id",
  // validator,
  // adminHandler,
  categoryController.deletePCategory
);

module.exports = router;
