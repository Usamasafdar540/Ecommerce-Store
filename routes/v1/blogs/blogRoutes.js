const express = require("express");
const router = express.Router();
const fileUploader = require("../../../middlewares/fileupload/fileUpload");
const blogsController = require("../../../controllers/blogs/blogsController");
const validator = require("../../../middlewares/tokenHandler/validateToken");
const adminHandler = require("../../../middlewares/roleHandler/roles");
router.post("/createblog", validator, adminHandler, blogsController.createBlog);
router.get("/getallblogs", blogsController.getBlogs);
router.get("/getablog/:id", blogsController.getaBlog);
router.put("/updateblog/:id", blogsController.updateBlog);
router.delete("/deleteBlog/:id", blogsController.deleteBlog);
router.put("/likeblog", validator, blogsController.liketheBlog);
router.put("/dislikeblog", validator, blogsController.disliketheBlog);

module.exports = router;
