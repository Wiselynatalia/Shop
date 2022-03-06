const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows, fieldData]) => {
    res.render("shop/product-list", {
      prods: rows,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  const proID = req.params.productID;
  Product.findByID(proID)
    .then(([prod]) => {
      res.render("shop/product-detail", {
        product: prod[0],
        pageTitle: prodDetail.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      console.log("ROWS", rows);
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log("ERROR"));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      //Filter products in the cart
      const cartProducts = [];
      for (p of products) {
        const cartProductData = cart.products.find((prod) => prod.id === p.id);
        if (cartProductData) {
          console.log("QTY", cartProductData.qty);
          cartProducts.push({ productData: p, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.addToCart = (req, res, next) => {
  const proID = req.body.productID;
  Product.findByID(proID, (product) => {
    console.log("Product", product);
    Cart.addProduct(product.id, product.price);
    res.redirect("/cart");
  });
};
//Delete item
exports.deleteCartItem = (req, res, next) => {
  const proID = req.body.productID;
  const price = req.body.price;
  console.log("proID", proID);
  Cart.deleteProduct(proID, price);
  res.redirect("/cart");
};
