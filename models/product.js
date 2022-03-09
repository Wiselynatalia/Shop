const getDb = require("../util/database").getDb;
var ObjectId = require("mongodb").ObjectId;

class Product {
  constructor(title, description, price, imageURL, userID) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageURL = imageURL;
    this.userID = userID;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: ObjectId(id) })
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: ObjectId(id) })
      .then((product) => {
        console.log("After deletion", product);
        return product;
      })
      .catch((err) => console.log(err));
  }

  static updateProduct(id, title, imageURL, price, description) {
    const db = getDb();
    console.log("ID", id);
    return db
      .collection("products")
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            title: title,
            description: description,
            price: price,
            imageURL: imageURL,
          },
        }
      )
      .then((product) => {
        console.log("Updated product:", product, this.title);
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
