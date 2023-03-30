const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Please enter a small name"],
    minLength: [4, "Please enter atleast a name of 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter a valid email"],
    unique: [validator.isEmail, "Enter a valid email"],
    // unique: [true, "Enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    minLength: [8, "Password should have 8 characters"],
    select: false,
  },
  avatar: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  resetPassToken: String,
  resetPassExpire: Date,
});

// ================password hashed================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrypt.hash(this.password, 10);
});

// ================Json web token================
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ================ password compare ================
userSchema.methods.comparePassword = async function (enteredPass) {
  // const isMatched = await bycrypt.compare(enteredPass, this.password);

  return await bycrypt.compare(enteredPass, this.password);
};

// ================ Generating Password Reset Token =================
userSchema.methods.getResetPasswordToken = function () {
  // custom token generate
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and adding resetPasswordToken to userSchema
  this.resetPassToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPassExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("userModel", userSchema);
