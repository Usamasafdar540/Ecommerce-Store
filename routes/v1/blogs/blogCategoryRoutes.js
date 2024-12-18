const express = require("express");
const router = express.Router();
const blogCategoryController = require("../../../controllers/category/blogCategoryController");
const validator = require("../../../middlewares/tokenHandler/validateToken");
const adminHandler = require("../../../middlewares/roleHandler/roles");
router.post(
  "/createcategory",
  //   validator,
  //   adminHandler,
  blogCategoryController.createCategory
);
router.get(
  "/singlepcategory/:id",
  // validator,
  // adminHandler,
  blogCategoryController.getaProductsCat
);
router.get(
  "/allproductcategory",
  // validator,
  // adminHandler,
  blogCategoryController.getProductsCat
);
router.put(
  "/updateproductcategory/:id",
  // validator,
  // adminHandler,
  blogCategoryController.updatePCategory
);
router.delete(
  "/deleteproductcategory/:id",
  // validator,
  // adminHandler,
  blogCategoryController.deletePCategory
);
module.exports = router;
