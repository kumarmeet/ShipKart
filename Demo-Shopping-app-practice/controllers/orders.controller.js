const Order = require("../models/order.model");
const User = require("../models/user.model");

const getOrder = (req, res) => {
  res.render("customer/orders/all-orders");
};

const addOrder = async (req, res, next) => {
  const cart = res.locals.cart;
  let userDoc = null;

  try {
    userDoc = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDoc);

  try {
    await order.save();
  } catch (error) {
    return next(error);
  }

  req.session.cart = null;

  res.redirect("/orders");
};

module.exports = {
  addOrder: addOrder,
  getOrder: getOrder,
};
