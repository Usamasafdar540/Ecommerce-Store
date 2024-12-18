const express = require("express");
const router = express.Router();
const userRoutes = require("../routes/v1/users/userRoutes");
const adminRoutes = require("../routes/v1/admin/adminRoutes");
const productRoutes = require("../routes/v1/product/productRoute");
const blogRoutes = require("../routes/v1/blogs/blogRoutes");
const ProductCategoryRoutes = require("./v1/product/productCategoryRoutes");
const blogCategoryRoutes = require("./v1/blogs/blogCategoryRoutes");
const cartRoutes = require("./v1/cart/cartRoutes");
const brandRoutes = require("./v1/brand/brandRoute");
const couponRoutes = require("../routes/v1/coupon/couponRoutes");
const orderRoutes = require("../routes/v1/order/orderRoutes");

// Use the route modules for specific paths
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/product", productRoutes);
router.use("/blogs", blogRoutes);
router.use("/category", ProductCategoryRoutes);
router.use("/blogCategory", blogCategoryRoutes);
router.use("/brands", brandRoutes);
router.use("/coupon", couponRoutes);
router.use("/order", orderRoutes);

router.use("/cart", cartRoutes);

module.exports = router;
