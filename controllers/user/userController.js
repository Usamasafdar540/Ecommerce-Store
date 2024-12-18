const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Cart = require("../../models/cartModel");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../../services/emailService");
const jwt = require("jsonwebtoken");

const {
  registerUserValidations,
  updatePasswordValidation,
  loginUserValidation,
} = require("../../middlewares/validation/user/userValidation");
const bcrypt = require("bcrypt");
const createUser = asyncHandler(async (req, res, next) => {
  try {
    const { error } = registerUserValidations.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { name, email, mobile, password, address } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User Already Exist with this Email",
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      mobile,
      address,
      password: hash,
      roles: ["user"],
    });
    const result = await user.save();
    const payload = {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      roles: result.roles,
    };
    return res.status(200).json({
      status: true,
      message: "User Created Successfully",
      data: payload,
    });
  } catch (error) {
    next(error);
  }
});
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { error } = loginUserValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        status: false,
        message: "Invalid password",
      });
    }
    const isAdmin = user.roles.includes("admin");
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      isAdmin: isAdmin,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      status: true,
      message: "User logged in successfully",
      userType: isAdmin ? "admin" : "user",
      data: tokenPayload,
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const result = await User.find({ roles: { $ne: "admin" } });
    if (result) {
      return res.status(200).json({
        status: true,
        message: "Users Found Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const getSingleUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await User.findById(id);
    if (result) {
      return res.status(200).json({
        status: true,
        message: "User Found With this id ",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
// Logout route is always optional and is not used oftenly
// const logoutUser = asyncHandler(async (req, res, next) => {
//   try {
//     res.clearCookie("token");
//     res.status(200).json({
//       status: true,
//       message: "User logged out successfully",
//     });
//     // console.log(logoutUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//     });
//   }
// });
const UpdatePassword = asyncHandler(async (req, res) => {
  try {
    const { error } = updatePasswordValidation.validate(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }

    const { oldPassword, newPassword } = req.body;
    const id = req.params.id;

    console.log(`Updating password for user with ID: ${id}`);

    const user = await User.findById(id);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({
        status: false,
        message: "No User Found with this id",
      });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      console.log("Invalid current password");
      return res.status(400).json({
        status: false,
        message: "Invalid Current Password",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashed });

    console.log("Password updated successfully");

    // Fetch the updated user to include in the response
    const updatedUser = await User.findById(id);

    return res.status(200).json({
      status: true,
      message: "Password Update Successful",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in UpdatePassword:", error);

    return res.status(500).json({
      status: false,
      message: "Error In Updating Password",
      error: error.message,
    });
  }
});
// forgot password middleware With Node Mailer
const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "No User Found with this email",
      });
    }

    // Generate a reset token and OTP
    const resetToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const resetPasswordLink = `http://your-app.com/reset-password/${resetToken}`;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration
    user.otp = otp;
    const result = await user.save();
    await sendEmail(
      email,
      "Password Reset Link and OTP",
      `Use the following OTP to reset your password: Your OTP is: ${otp} & link is :${resetPasswordLink}`
    );
    return res.status(200).json({
      status: true,
      message: "Reset Password email sent successfully",
      // data: result,
      resetPasswordLink,
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in Sending Email",
      error: error.message,
    });
  }
});

// Reset Password Node mailer
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      res.status(404).json({
        status: false,
        message: "Invalid or expired Reset Token",
      });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    user.otp = null;

    await user.save();
    return res.status(200).json({
      status: true,
      message: "Password Reset Successfully ",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in resetting Password",
      error: error.message,
    });
  }
});
const getWishlist = asyncHandler(async (req, res) => {
  const id = req.user && req.user.id;
  try {
    const findUser = await User.findById(id)
      .populate("wishlist")
      .select("-password");
    if (findUser) {
      res.status(200).json({
        status: true,
        message: "Wishlist For User is",
        data: findUser,
      });
    }
  } catch (error) {
    next(error);
  }
});
//cart functionality
const userCart = asyncHandler(async (req, res, next) => {
  try {
    const { cart } = req.body;
    const userId = req.user && req.user?.id;

    // Retrieve user and existing cart
    const user = await User.findById(userId);
    const existingCart = await Cart.findOne({ orderby: user?.id });

    // Delete existing cart if it exists
    if (existingCart) {
      await Cart.deleteOne({ _id: existingCart.id });
    }

    // Build products array
    const products = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.id).select("price").exec();
        return {
          product: item.id,
          count: item.count,
          color: item.color,
          price: product.price,
        };
      })
    );

    // Calculate cart total
    const cartTotal = products.reduce(
      (total, product) => total + product.price * product.count,
      0
    );

    // Create and save new cart
    const newCart = await Cart.create({
      products,
      cartTotal,
      orderby: user?.id,
    });

    res.json(newCart);
  } catch (error) {
    next(error);
  }
});

const getUserCart = asyncHandler(async (req, res, next) => {
  const id = req.user && req.user?.id;
  try {
    const result = await Cart.findOne({ orderby: id })
      .populate("products.product")
      .select("products");
    if (result) {
      res.status(200).json({
        status: true,
        message: "Cart Items Fetched Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});

const emptyCart = asyncHandler(async (req, res, next) => {
  const id = req.user && req.user?.id;
  try {
    const user = await User.findOne({ id }); // Assuming user IDs are stored in "_id" field
    const cart = await Cart.findOneAndDelete({ orderby: user.id });
    res.json(cart);
  } catch (error) {
    next(error);
  }
});




module.exports = {
  createUser,
  loginUser,
  getUsers,
  getSingleUser,
  UpdatePassword,
  forgotPassword,
  resetPassword,
  getWishlist,
  userCart,
  getUserCart,
  emptyCart,
};
