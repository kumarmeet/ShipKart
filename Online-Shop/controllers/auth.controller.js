const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

const getSignUp = (req, res) => {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }

  res.render("customer/auth/signup", { inputData: sessionData });
};

const signup = async (req, res, next) => {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirm(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataSession(
      req,
      {
        errorMessage:
          "Please check input. Password must be at least 6 characters long.",
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
    req.body.postal,
    req.body.city
  );

  try {
    const existAlready = await user.existAlready();

    if (existAlready) {
      sessionFlash.flashDataSession(
        req,
        {
          errorMessage: "User exists already! Try logging in instead!",
          ...enteredData,
        },
        () => {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.signUp();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
};

const getLogin = (req, res) => {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("customer/auth/login", { inputData: sessionData });
};

const login = async (req, res, next) => {
  const user = new User(req.body.email, req.body.password);
  let existingUser = null;

  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage:
      "Invalid credentials - please double check your email and password.",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataSession(req, sessionErrorData, () => {
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
  getSignUp: getSignUp,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
