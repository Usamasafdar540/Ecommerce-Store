const asyncHandler = require("express-async-handler");
const Brand = require("../../models/brandModel");
const {
  createBrandValidation,
  updateBrandValidation,
  getaBrandValidation,
  deleteBrandValidation,
} = require("../../middlewares/validation/brands/brandValidation");
const jwt = require("jsonwebtoken");
const createBrand = asyncHandler(async (req, res, next) => {
  try {
    const { error } = createBrandValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { title } = req.body;
    const brand = new Brand({
      title,
    });
    const result = await brand.save();
    if (result) {
      res.status(200).json({
        status: true,
        message: "Blog created successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error, error.message, "oops");
    next(error);
  }
});
const getaBrand = asyncHandler(async (req, res, next) => {
  try {
    const { error } = getaBrandValidation.validate(req.params);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    console.log(id);
    const result = await Brand.findOne(id);
    console.log(result);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Product Brand for this id Found Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const getBrands = asyncHandler(async (req, res, next) => {
  try {
    const result = await Brand.find();
    if (result) {
      res.status(200).json({
        status: true,
        message: "Product Categories Found Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const updateBrand = asyncHandler(async (req, res, next) => {
  try {
    const { error } = updateBrandValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    const { title } = req.body;
    const result = await Brand.findByIdAndUpdate(
      id,
      {
        title,
      },
      {
        new: true,
      }
    );
    if (result) {
      res.status(200).json({
        status: true,
        message: "Brand Updated successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error, error.message, "oops");
    next(error);
  }
});

const deleteBrand = asyncHandler(async (req, res, next) => {
  try {
    const { error } = deleteBrandValidation.validate(req.params);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    const result = await Brand.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Brand Deleted successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error, error.message, "oops");
    next(error);
  }
});
module.exports = {
  createBrand,
  updateBrand,
  getaBrand,
  getBrands,
  deleteBrand,
};
