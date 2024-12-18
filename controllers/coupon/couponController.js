const Coupon = require("../../models/couponModel");
const User = require("../../models/userModel");
const Cart = require("../../models/cartModel");
const asyncHandler = require("express-async-handler");
const {
  createCouponValidation,
  getSingleCouponValidation,
  updateCouponValidation,
  deleteCouponValidation,
} = require("../../middlewares/validation/coupon/couponValidation");
const createCoupon = asyncHandler(async (req, res, next) => {
  try {
    const { error } = createCouponValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { name, expiry, discount } = req.body;
    const coupon = new Coupon({
      name,
      expiry,
      discount,
    });
    const result = await coupon.save();
    if (result) {
      res.status(200).json({
        status: true,
        message: "Coupon Created Successfully ",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});

const getSingleCoupon = asyncHandler(async (req, res, next) => {
  try {
    const { error } = getSingleCouponValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const id = req.params.id;
    const result = await Coupon.findById(id);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Coupon Found  Successfully ",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const getAllCoupons = asyncHandler(async (req, res, next) => {
  try {
    const result = await Coupon.find();
    if (result) {
      res.status(200).json({
        status: true,
        message: "Coupon Found  Successfully ",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { error } = updateCouponValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { id } = req.params.id;
    const { name, expiry, discount } = req.body;
    const result = await Coupon.findByIdAndUpdate(
      id,
      { name, expiry, discount },
      {
        new: true,
      }
    );
    if (result) {
      res.status(200).json({
        status: true,
        message: "Coupon Updated  Successfully ",
        data: result,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params.id;
  try {
    const { error } = deleteCouponValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const result = await Coupon.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Coupon Deleted  Successfully ",
        data: result,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const id = req.user && req.user?.id;
  console.log(id, "User ID");
  const user = await User.findOne({ id });
  const cart = await Cart.findOne({ orderby: user?.id }).populate(
    "products.product"
  );
  console.log(cart);

  if (!cart) {
    return res.status(404).json({
      title: "Cart Not Found",
      message: "Cart not found for the user",
    });
  }

  const { cartTotal } = cart;

  const validCoupon = await Coupon.findOne({ name: coupon });

  if (!validCoupon) {
    throw new Error("Invalid Coupon");
  }

  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  await Cart.findOneAndUpdate(
    { orderby: user.id },
    { totalAfterDiscount },
    { new: true }
  );

  res.json(totalAfterDiscount);
});

module.exports = {
  createCoupon,
  getSingleCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
  applyCoupon,
};
