const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; //getting image name
    this.imagePath = `products-data/images/${productData.image}`; //getting image path
    // (/products/assets) path or url is used dynamically using app.use() in app.js for don't giving any hint of folder structure to the users
    this.imageUrl = `/products/assets/images/${productData.image}`;

    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findAll() {
    const products = await db.getDB().collection("products").find().toArray();

    return products.map((productDoc) => {
      return new Product(productDoc);
    });
  }

  async save() {
    const productDoc = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    await db.getDB().collection("products").insertOne(productDoc);
  }
}

module.exports = Product;
