const mongodb = require("mongodb");
const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; //getting image name
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  updateImageData() {
    this.imagePath = `products-data/images/${this.image}`; //getting image path
    // (/products/assets) path or url is used dynamically using app.use() in app.js for don't giving any hint of folder structure to the users
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  static async findById(productId) {
    let prodId = null;

    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404; //add a code property into error object
      throw error;
    }

    const product = await db
      .getDB()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find the product with provided id.");
      error.code = 404;
      throw error;
    }

    return new Product(product);
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

    //if has and id then update
    if (this.id) {
      //if admin not select the image then image key:value should be delete and prevent the image updating
      if (!this.image) {
        delete productDoc.image;
      }

      await db
        .getDB()
        .collection("products")
        .updateOne(
          { _id: new mongodb.ObjectId(this.id) },
          {
            $set: productDoc,
          }
        );
    } else {
      await db.getDB().collection("products").insertOne(productDoc);
    }
  }

  async remove() {
    return await db
      .getDB()
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(this.id) });
  }
}

module.exports = Product;
