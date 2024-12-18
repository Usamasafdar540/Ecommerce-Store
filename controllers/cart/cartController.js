const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Cart = require("../../models/cartModel");
const asyncHandler = require("express-async-handler");
const userCartValidation = require("../../middlewares/validation/cart/cartValidation");
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
const userCart = asyncHandler(async (req, res, next) => {
  try {
    const { error } = userCartValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }

    const { cart } = req.body;
    const userId = req.user && req.user?.id;
    const user = await User.findById(userId);
    const existingCart = await Cart.findOne({ orderby: user?.id });
    if (existingCart) {
      await Cart.deleteOne({ _id: existingCart.id });
    }
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
    const cartTotal = products.reduce(
      (total, product) => total + product.price * product.count,
      0
    );
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
  const userId = req?.user && req.user?.id;
  try {
    const user = await User.findById(userId);
    console.log(user, "MY USER");
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const cart = await Cart.findOneAndDelete({ orderby: user.id });

    if (cart) {
      res.json({
        status: true,
        message: "Cart Items Deleted Successfully",
        data: cart,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Cart not found for the user",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getWishlist,
  userCart,
  getUserCart,
  emptyCart,
};
