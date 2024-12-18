const asyncHandler = require("express-async-handler");
const Blog = require("../../models/blogModel");
const {
  likeDislikeBlogValidation,
} = require("../../middlewares/validation/blogs/blogValidation");
const createBlog = asyncHandler(async (req, res, next) => {
  try {
    const imagePath = req.file.path;
    const result = await Blog.create(req.body);
    res.status(200).json({
      status: true,
      message: "Blog Created Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    next(error);
  }
});
const getBlogs = asyncHandler(async (req, res, next) => {
  try {
    const result = await Blog.find();
    if (result) {
      res.status(200).json({
        status: true,
        message: "Blogs Fetched Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const getaBlog = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    )
      // .select("-dislikes.password")
      .lean()
      .populate("likes")
      .populate("dislikes");
    updateViews.dislikes.forEach((dislike) => {
      delete dislike.password;
      delete dislike.roles;
      delete dislike.address;
      delete dislike.wishlist;
      delete dislike.cart;
    });
    updateViews.likes.forEach((like) => {
      delete like.password;
      delete like.roles;
      delete like.address;
      delete like.wishlist;
      delete like.cart;
    });
    return res.status(200).json({
      status: true,
      message: "Blogs Fetched Successfully",
      data: updateViews,
    });
  } catch (error) {
    next(error);
  }
});
const updateBlog = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(result);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Blog Updated Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});
const deleteBlog = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Blog.findByIdAndDelete(id);
    console.log(result);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Blog Deleted Successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
});

const liketheBlog = asyncHandler(async (req, res) => {
  try {
    const { error } = likeDislikeBlogValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { blogId } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    const loginUserId = req.user && req.user.id; 
    const isLiked = blog && blog.isLiked;
    const alreadyDisliked =
      blog &&
      blog.dislikes &&
      blog.dislikes.find(
        (userId) => userId?.toString() === loginUserId?.toString()
      );
    if (alreadyDisliked) {
      blog.dislikes.pull(loginUserId);
      blog.isDisliked = false;
    }

    if (isLiked) {
      blog.likes.pull(loginUserId);
      blog.isLiked = false;
      res.json(blog);
    } else {
      blog.likes.push(loginUserId);
      blog.isLiked = true;
      const updatedBlog = await blog.save();
      return res.status(200).json({
        status: true,
        message: "Blog Liked",
        data: updatedBlog,
      });
    }
  } catch (error) {
    console.error("Error in liketheBlog:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});

const disliketheBlog = asyncHandler(async (req, res) => {
  try {
    const { error } = likeDislikeBlogValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { blogId } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }
    const loginUserId = req.user && req.user.id;
    console.log(loginUserId, "UserId");
    const alreadyLiked = blog.likes.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      return res.json(updatedBlog);
    }

    const isDisliked = blog && blog.isDisliked;

    if (isDisliked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      return res.json(updatedBlog);
    } else {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      return res.json(updatedBlog);
    }
  } catch (error) {
    console.error("Error in disliketheBlog:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = disliketheBlog;

module.exports = {
  createBlog,
  getBlogs,
  liketheBlog,
  disliketheBlog,
  updateBlog,
  getaBlog,
  deleteBlog,
};
