const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectId;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; //{items:[]}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
  //static method act on entire user collection (finding,deleting)
  //instance method act on each individual document

  getCart() {
    //goal: return all products + qty
    const db = getDb();
    //get all productID from cart
    const productIds = this.cart.items.map((i) => {
      return i.productID;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        //products is an array of productIds, we need
        //to add qty(from cart) to it too
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productID.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  addToCart(product) {
    //check if cart contains the product
    //findIndex return index or -1
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productID.toString() === product._id.toString();
    });
    const updatedCartItems = [...this.cart.items];
    console.log("CartProductIndex", cartProductIndex);
    if (cartProductIndex >= 0) {
      console.log("This", this.cart.items[cartProductIndex]);
      const newQty = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQty;
    } else {
      updatedCartItems.push({
        productID: new ObjectId(product._id),
        quantity: 1,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  deleteCartItem(id) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productID.toString() !== id.toString();
    });

    const db = getDb();
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: { cart: { items: updatedCartItems } },
      }
    );
  }

  addOrder() {
    const db = getDb();
    //clear user cart once order is added
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        db.collection("users").updateOne(
          { _id: new ObjectId(this._id) },
          {
            $set: {
              cart: {
                items: [],
              },
            },
          }
        );
      });
  }

  getOrders() {
    const db = getDb();
    //need to add '' for nested search
    //user has multiple orders
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }
}

module.exports = User;
