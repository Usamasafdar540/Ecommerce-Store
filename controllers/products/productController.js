const {
  createProductValidations,
} = require("../../middlewares/validation/product/productValidation");
const Product = require("../../models/productModel");
const productcategoryModel = require("../../models/productcategoryModel");
const User = require("../../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res, next) => {
  try {
    const { error } = createProductValidations.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const {
      title,
      //   slug,
      description,
      price,
      quantity,
      category,
      brand,
      color,
    } = req.body;
    const imagePath = req.file.path;
    const slug = slugify(title, { lower: true });

    const product = new Product({
      title,
      slug,
      description,
      price,
      quantity,
      category,
      brand,
      color,
      image: imagePath,
    });
    const result = await product.save();
    if (result) {
      return res.status(200).json({
        status: true,
        message: "Product Created Successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    next(error);
  }
});

const getProduct = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Product.findById(id);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Product With this id is",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error Getting product:", error);
    next(error);
  }
});
const getAllProducts = asyncHandler(async (req, res, next) => {
  try {
    //filtering limiting pagination
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));
    //SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }
    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join("");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    console.log(req.query);
    if (product) {
      res.status(200).json({
        status: true,
        message: "Products Are Fetched Successfully",
        data: product,
      });
    }
  } catch (error) {
    console.error("Error Getting products:", error);
    next(error);
  }
});
const updateProduct = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, price, quantity, category, brand, color } =
      req.body;
    const slug = slugify(title, { lower: true });

    const result = await Product.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        description,
        price,
        quantity,
        category,
        brand,
        color,
      },
      {
        new: true,
      }
    );
    if (result) {
      res.status(200).json({
        status: true,
        message: "Product Updated Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Product deleted Successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error, "Failed To delete Product");
    next(error);
  }
});
const addToWishlist = asyncHandler(async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const productId = req.body.productId;

    const user = await User.findById(userId).select("-password");

    const alreadyExists = user.wishlist.includes(productId);

    if (!alreadyExists) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({
      success: !alreadyExists,
      message: alreadyExists ? "Already in Wishlist" : "Added to Wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
});

//REmove from wishlist
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const productId = req.params.productId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    const alreadyExists = user.wishlist
      .map((item) => item.toString())
      .includes(productId);

    if (alreadyExists) {
      user.wishlist = user.wishlist.filter(
        (item) => item.toString() !== productId
      );
      await user.save();
    }

    res.status(200).json({
      success: alreadyExists,
      message: alreadyExists
        ? "Product removed from Wishlist"
        : "Not in Wishlist",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { id } = req?.user || {};
  const { star, prodId, comment } = req.body;

  try {
    const product = await Product.findById(prodId);
    const userRatingIndex = product.ratings.findIndex(
      (rating) => rating.postedby.toString() === id.toString()
    );

    if (userRatingIndex !== -1) {
      // User has already rated, update the existing rating
      product.ratings[userRatingIndex].star = star;
      product.ratings[userRatingIndex].comment = comment;
    } else {
      // User is rating for the first time, add a new rating
      product.ratings.push({
        star,
        comment,
        postedby: id,
      });
    }

    // Update the product with the new ratings
    await product.save();

    // Recalculate totalrating
    const totalRating = product.ratings.length;
    const ratingsum = product.ratings.reduce(
      (prev, curr) => prev + curr.star,
      0
    );
    const actualRating =
      totalRating > 0 ? Math.round(ratingsum / totalRating) : 0;

    // Update the product with the new totalrating
    const updatedProduct = await Product.findByIdAndUpdate(
      prodId,
      { totalrating: actualRating },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});
const uploadImages = asyncHandler(async (req, res, next) => {});
module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  removeFromWishlist,
};
