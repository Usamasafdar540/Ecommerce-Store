const User = require("../../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
  addAdminValidation,
} = require("../../middlewares/validation/admin/adminValidations");
const bcrypt = require("bcrypt");
const validateMongoId = require("../../utils/validateMongoDbId");
const addAdmin = asyncHandler(async (req, res) => {
  try {
    const { error } = addAdminValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { email, name, password } = req.body;
    const adminExist = await User.findOne({ email, roles: ["admin"] });
    if (adminExist) {
      return res.status(400).json({
        status: false,
        message: "Admin already exists",
      });
    }
    // Password Hashing
    const hash = await bcrypt.hash(password, 10);
    const adminUser = new User({
      email: "Admin@gmail.com",
      name: "Admin",
      password: hash, // Store the hashed password
      roles: ["admin"],
    });
    await adminUser.save();
    res.status(201).json({
      status: true,
      message: "Admin created successfully",
      data: adminUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Cannot create Admin",
      error: error.message,
    });
  }
});
const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    validateMongoId;
    console.log(id);
    const result = await User.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        status: true,
        message: "User deleted With this id ",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { error } = updateUserValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    validateMongoId;
    const { name, email, mobile } = req.body;
    const result = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        mobile,
      },
      {
        new: true,
      }
    );
    if (result) {
      res.status(200).json({
        status: true,
        message: "User Successfully Updated",
        data: result,
      });
    }
    console.log("The Deleted User is", result);
  } catch (error) {
    next(error);
  }
});
const deactivateUser = asyncHandler(async (req, res, next) => {
  try {
    const { error } = activateDeactivateUserValidation.validate(req.params);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    validateMongoId;
    const user = User.findById(id);
    if (!user) {
      res.status(404).json({
        status: false,
        message: "No USer found with this id ",
      });
    }
    user.status = "deactivated";
    await user.save();
    res.status(200).json({
      status: true,
      message: "User Is Deactivated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
const activateUser = asyncHandler(async (req, res, next) => {
  try {
    const { error } = activateDeactivateUserValidation.validate(req.params);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const userId = req.params.id;
    validateMongoId;
    validateMongoId;
    console.log(userId);
    const user = User.findById(userId);
    if (!user) {
      res.status(404).json({
        status: false,
        message: "No USer found with this id ",
      });
    }
    console.log(user);
    user.status = "activated";
    console.log(user.status);
    await user.save();
    res.status(200).json({
      status: true,
      message: "User Is activated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = {
  addAdmin,
  deleteUser,
  updateUser,
  activateUser,
  deactivateUser,
};
