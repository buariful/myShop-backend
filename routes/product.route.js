const express = require("express");
const {
  getAllProducts,
  createPoduct,
  updateProuduct,
  deleteProduct,
  getSingleProduct,
} = require("../controller/product.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authenticate");

// --------------------------------
const router = express.Router();

router.route("/products").get(isAuthenticated, getAllProducts);
// .post(isAuthenticated, roleAuthorize("admin"), createPoduct);
router
  .route("/product/add")
  .post(isAuthenticated, roleAuthorize("admin"), createPoduct);
router
  .route("/product/:id")
  .get(getSingleProduct)
  .put(updateProuduct)
  .delete(deleteProduct);

module.exports = router;
