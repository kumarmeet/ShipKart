const isEmpty = (value) => {
  return !value || value.trim() === "";
};

const userCredentialsAreValid = (email, password) => {
  return email && email.includes("@") && password && password.trim().length > 5;
};

const emailIsConfirm = (email, confirmEmail) => {
  return email.trim() === confirmEmail.trim();
};

const userDetailsAreValid = (email, password, name, street, postal, city) => {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
};

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirm: emailIsConfirm,
};
