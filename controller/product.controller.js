const asyncErrors = require("../middleware/asyncErrors");
const productModel = require("../models/product.model");
const ErrorHandler = require("../utils/errorHanler");
const ApiFilter = require("../utils/apiFilter");

// get all product
exports.getAllProducts = asyncErrors(async (req, res) => {
  const resultPerPage = 3;

  const apiFilter = new ApiFilter(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFilter.query;
  res.status(200).json({
    success: true,
    data: products,
    totalProducts: products.length,
  });
});
// get a single product
exports.getSingleProduct = asyncErrors(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

// create product --Admin
exports.createPoduct = asyncErrors(async (req, res) => {
  req.body.user = req.user.id;
  const product = await productModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// update a product --Admin
exports.updateProuduct = asyncErrors(async (req, res) => {
  let product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete a product --Admin
exports.deleteProduct = asyncErrors(async (req, res) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await productModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted succesfully",
  });
});
