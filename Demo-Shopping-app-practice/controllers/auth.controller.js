const User = require("../models/User.Model");

const authUtil = require("../util/authentication");

const validation = require("../util/validation");

const sessionFlash = require("../util/session-flash");

const getSignup = (req, res) => {
  let sessionData = sessionFlash.getFlashData(req);

  //if user comes first time the signup page and all fields are empty then this if block will work
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      name: "",
      street: "",
      city: "",
      postal: "",
    };
  }

  res.render("customer/auth/signup", { sessionData: sessionData });
};

const signup = async (req, res, next) => {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    name: req.body.fullname,
    street: req.body.street,
    city: req.body.city,
    postal: req.body.postal,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.city,
      req.body.postal
    ) ||
    !validation.isEmailConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Please check your input.",
        ...enteredData,
      },
      () => {
        res.redirect("/signup");
      }
    );

    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.city,
    req.body.postal
  );

  try {
    const isUserExist = await user.existsAlready();

    if (isUserExist) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User already exists! Try login instead!",
          ...enteredData,
        },
        () => {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect("/login");
};

const getLogin = (req, res) => {
  let sessionData = sessionFlash.getFlashData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("customer/auth/login", { sessionData: sessionData });
};

const login = async (req, res, next) => {
  const user = new User(req.body.email, req.body.password);
  let existingUser = null;

  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  const sessionErrorData = {
    errorMessage: "Invalid Credentials. Please try again!",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }

  const passwordCorrect = await user.hasMatchingPassword(existingUser.password);

  if (!passwordCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
};

const logout = (req, res) => {
  authUtil.destroyUserAuthSession(req);

  res.redirect("/login");
};

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
