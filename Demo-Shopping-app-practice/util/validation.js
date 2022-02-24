const isEmpty = (value) => !value || value.trim() === "";

const userCredentialsAreValid = (email, password) => {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
};

const userDetailsAreValid = (email, password, name, street, city, postal) => {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(city) &&
    !isEmpty(postal)
  );
};

const isEmailConfirmed = (email, confirmEmail) =>
  email.trim() === confirmEmail.trim();

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  isEmailConfirmed: isEmailConfirmed,
};
