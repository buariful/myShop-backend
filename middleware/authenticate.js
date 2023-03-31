const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const ErrorHandler = require("../utils/errorHanler");
const asyncErrors = require("./asyncErrors");

exports.isAuthenticated = asyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log("isAuthenticated");
  if (!token) {
    return next(new ErrorHandler("Pleas login/register first", 401));
  }

  const getJwtData = await jwt.verify(token, process.env.JWT_SECRET);

  req.user = await userModel.findById(getJwtData.id);
  next();
});

exports.roleAuthorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new ErrorHandler(`${req.user.role} is not allowed`, 403));
    }
    next();
  };
};
