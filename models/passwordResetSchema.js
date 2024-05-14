const mongoose = require("mongoose");

const PasswordReset = new mongoose.Schema(
  {
    otp: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    otpUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PasswordReset", PasswordReset);
