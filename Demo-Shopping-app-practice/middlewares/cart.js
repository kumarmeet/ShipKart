const Cart = require("../models/Cart.model");

const initializeCart = (req, res, next) => {
  let cart = null;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    const sessionCart = req.session.cart;
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    );
  }

  res.locals.cart = cart;
  next();
};

module.exports = initializeCart;
