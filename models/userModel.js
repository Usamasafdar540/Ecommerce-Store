const { Mongoose, default: mongoose } = require("mongoose");
const userSchema = new mongoose.Schema(
  // admin credentials/
  // "email": "Admin23@gmail.com",
  // "password": "Usama122"
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v);
        },
        message: "Invalid email address",
      },
    },
    mobile: {
      type: String,
      // required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
    ],
    status: {
      type: String,
      enum: ["activated", "deactivated"],
      default: "activated",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: String,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
    newPassword: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
