const mongoose = require("mongoose");
const validateMongoId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    res.status(400).json({
      status: false,
      message: "The mongo db id is invalid or not found",
    });
  }
};
module.exports = validateMongoId;
