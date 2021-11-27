const bcrypt = require("bcryptjs");

const db = require("../data/database");

class User {
  constructor(email, password, fullName, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullName;

    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  getUserWithSameEmail() {
    return db.getDB().collection("users").findOne({ email: this.email });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  async existAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signUp() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    const result = await db.getDB().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });

    return result;
  }
}

module.exports = User;
