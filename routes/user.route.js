const express = require("express");
const {
  registerUser,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
  getUser,
  updateUserPassword,
  getAllUser,
  getSingleUser,
  deleteUser,
} = require("../controller/user.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authenticate");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
// router.route("/login/password/forgot").post(forgotPassword);
// router.route("/login/password/reset/:token").put(resetPassword);
router.route("/logout").post(logOut);
router.route("/profile").get(isAuthenticated, getUser);
router.route("/update-user-password").put(isAuthenticated, updateUserPassword);

router
  .route("/all-users")
  .get(isAuthenticated, roleAuthorize("admin"), getAllUser);
router
  .route("/single-users/:id")
  .get(isAuthenticated, roleAuthorize("admin"), getSingleUser);

router
  .route("/user/:id")
  .delete(isAuthenticated, roleAuthorize("admin"), deleteUser);
module.exports = router;
