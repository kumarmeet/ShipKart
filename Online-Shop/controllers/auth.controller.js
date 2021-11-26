const User = require("../models/user.model");
const authUtil = require("../util/authentication");

const getSignUp = (req, res) => {
  res.render("customer/auth/signup");
};

const signup = async (req, res) => {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  await user.signUp();

  res.redirect("/login");
};

const getLogin = (req, res) => {
  res.render("customer/auth/login");
};

const login = async (req, res) => {
  const user = new User(req.body.email, req.body.password);
  const existingUser = await user.getUserWithSameEmail();

  if (!existingUser) {
    res.redirect("/login");
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    res.redirect("/login");
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
};

module.exports = {
  getSignUp: getSignUp,
  getLogin: getLogin,
  signup: signup,
  login: login,
};
