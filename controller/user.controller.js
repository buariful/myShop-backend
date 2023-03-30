const ErrorHandler = require("../utils/errorHanler");
const asyncErrors = require("../middleware/asyncErrors");
const userModel = require("../models/user.model");
const getToken = require("../utils/getToken");
const sendEmail = require("../utils/sendEmail.js");

// ===================== register a user =====================
exports.registerUser = asyncErrors(async (req, res, next) => {
  const { email, name, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      publicId: "sample public id",
      url: "sample url",
    },
  });

  getToken(user, 201, res);
});

// =====================  user login =====================
exports.loginUser = asyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email and password", 400));
  }

  const user = await userModel.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Please enter valid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please enter valid email or password", 401));
  }

  getToken(user, 200, res);
});

// ===================== user log out =====================
exports.logOut = asyncErrors((req, res, next) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    sucess: true,
    message: "Logout Succesfully",
  });
});

// ===================== Forgot Password =====================
// exports.forgotPassword = asyncErrors(async (req, res, next) => {
//   const user = await userModel.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new ErrorHandler("User not found", 404));
//   }

//   const resetToken = user.getResetPasswordToken();
//   await user.save({ validateBeforeSave: false });

//   const resetPasswordUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/password/reset/${resetToken}`;
//   const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `MyShop(furniture) Password Recovery`,
//       message,
//     });
//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${user.email} successfully`,
//     });
//   } catch (err) {
//     user.resetPassToken = undefined;
//     user.resetPassExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorHandler(err.message, 500));
//   }
// });

// ===================== reset password =====================
// exports.resetPassword = asyncErrors(async (req, res, next) => {

//   const resetPassToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await userModel.findOne({
//     resetPassToken,
//     resetPassExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new ErrorHandler("Token is invalid or has been expired", 400));
//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     return next(new ErrorHandler("Password does not matched", 400));
//   }

//   user.password = req.body.password;
//   user.resetPassToken = undefined;
//   user.resetPassExpire = undefined;

//   await user.save();

//   getToken(user, 200, res);
// });

// ===================== get user details ======================
exports.getUser = asyncErrors(async (req, res) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ============ update password ================
exports.updateUserPassword = asyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Your old password is not correct", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Please Enter same password in field", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  getToken(user, 200, res);
});

// ============== get all user (Admin) ============
exports.getAllUser = asyncErrors(async (req, res) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    users,
    totalUsers: users.length,
  });
});

// ============== get single user (Admin) ============
exports.getSingleUser = asyncErrors(async (req, res) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ======================= user delete (Admin) =============
exports.deleteUser = asyncErrors(async (req, res) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("user does not exists", 404));
  }
  const deletUser = await userModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
