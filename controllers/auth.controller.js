const getSignUp = (req, res) => {
  res.render("customer/auth/signup");
};

const getLogin = (req, res) => {};

module.exports = {
  getSignUp: getSignUp,
  getLogin: getLogin,
};
