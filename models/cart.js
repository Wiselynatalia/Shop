const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //Fetch previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      if (existingProduct) {
        existingProduct.qty += 1;
        console.log("Existing", existingProduct);
      } else {
        const newproduct = { id: id, qty: 1 };
        cart.products = [...cart.products, newproduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("Error", err);
      });
    });
    //Add new product or increase qty
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
        console.log("CART", cart);
      }
      const productToDelete = cart.products.find((p) => p.id === id);
      console.log("ID of ProdToDelete", id);
      if (!productToDelete) {
        return;
      }
      cart.totalPrice = cart.totalPrice - price * productToDelete.qty;
      cart.products = cart.products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("Error", err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
