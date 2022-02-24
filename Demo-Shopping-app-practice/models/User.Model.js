const bcrypt = require("bcryptjs");
const db = require("../data/database");

class User {
  constructor(email, password, fullname, street, city, postal) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    //object literal
    this.address = {
      street: street,
      city: city,
      postalCode: postal,
    };
  }

  getUserWithSameEmail() {
    return db.getDB().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();

    if (existingUser) {
      return true;
    }

    return false;
  }

  async signup() {
    return await db
      .getDB()
      .collection("users")
      .insertOne({
        email: this.email,
        password: await bcrypt.hash(this.password, 12),
        name: this.name,
        address: this.address,
      });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
