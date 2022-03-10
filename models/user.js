const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: String,
  email: String,
  cart: {
    items: [
      {
        productID: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
  },
});

//we can use populate to retrieve more information of product from productID
//as productID is referencing another collection (Product)
//req.user.populate('cart.items.productID')
//The string inside populate() is a path to the connection

userSchema.methods.addToCart = function (product) {
  //check if cart contains the product
  //findIndex return index or -1
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productID.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    const newQty = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQty;
  } else {
    updatedCartItems.push({
      productID: product._id,
      quantity: 1,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (id) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productID.toString() !== id.toString();
  });
  console.log("ProductID", updatedCartItems, "IDTODELETE", id);
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  const updatedCart = {
    items: [],
  };
  this.cart = updatedCart;
  this.save();
};

module.exports = mongoose.model("User", userSchema);
