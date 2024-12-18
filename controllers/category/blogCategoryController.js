const asyncHandler = require("express-async-handler");
const Category = require("../../models/blogCategoryModel");
const {
  createCategoryValidation,
  getaProductsCatValidation,
  updatePCategoryValidation,
  deletePCategoryValidation,
} = require("../../middlewares/validation/blogs/blogCatValidations");
const jwt = require("jsonwebtoken");
const createCategory = asyncHandler(async (req, res, next) => {
  try {
    const { error } = createCategoryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { title } = req.body;
    const category = new Category({
      title,
    });
    const result = await category.save();
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
const getaProductsCat = asyncHandler(async (req, res, next) => {
  try {
    const { error } = getaProductsCatValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    console.log(id);
    const result = await Category.findOne(id);
    console.log(result);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Product Category for this id Found Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const getProductsCat = asyncHandler(async (req, res, next) => {
  try {
    const result = await Category.find();
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
const updatePCategory = asyncHandler(async (req, res, next) => {
  try {
    const { error } = updatePCategoryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    const { title } = req.body;
    const result = await Category.findByIdAndUpdate(
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
        message: "category Updated successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error, error.message, "oops");
    next(error);
  }
});

const deletePCategory = asyncHandler(async (req, res, next) => {
  try {
    const { error } = deletePCategoryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    const result = await Category.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: true,
        message: "category Deleted successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error, error.message, "oops");
    next(error);
  }
});
module.exports = {
  createCategory,
  updatePCategory,
  getaProductsCat,
  getProductsCat,
  deletePCategory,
};
