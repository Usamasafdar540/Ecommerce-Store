const express = require("express");
const router = express.Router();
const brandController = require("../../../controllers/brands/brandsController");
const validator = require("../../../middlewares/tokenHandler/validateToken");
const adminHandler = require("../../../middlewares/roleHandler/roles");
router.post(
  "/createbrand",
  //   validator,
  //   adminHandler,
  brandController.createBrand
);
router.get(
  "/singlebrand/:id",
  // validator,
  // adminHandler,
  brandController.getaBrand
);
router.get(
  "/allbrands",
  // validator,
  // adminHandler,
  brandController.getBrands
);
router.put(
  "/updatebrand/:id",
  // validator,
  // adminHandler,
  brandController.updateBrand
);
router.delete(
  "/deletebrand/:id",
  // validator,
  // adminHandler,
  brandController.deleteBrand
);
module.exports = router;
