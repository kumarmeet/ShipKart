const Product = require("../models/Product.model");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render("customer/products/all-products", { products: products });
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("customer/products/products-details", { product: product });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllProducts: getAllProducts,
  getProduct: getProduct,
};
