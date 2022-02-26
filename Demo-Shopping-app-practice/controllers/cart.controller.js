const Product = require("../models/Product.model");

const addCartItem = async (req, res, next) => {
  let product = null;

  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    return next(error);
  }

  const cart = res.locals.cart;
  cart.addItem(product);
  req.session.cart = cart;

  res.status(201).json({
    message: "Cart updated",
    newTotalItems: cart.totalQuantity,
  });
};

module.exports = {
  addCartItem: addCartItem,
};
