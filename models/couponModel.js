const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    // slug is a short title that is used for SEO
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
