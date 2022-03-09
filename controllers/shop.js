const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((prods) => {
    res.render("shop/product-list", {
      prods: prods,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  const proID = req.params.productID;
  Product.findById(proID)
    .then((prod) => {
      res.render("shop/product-detail", {
        product: prod,
        pageTitle: prod.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((prods) => {
      res.render("shop/index", {
        prods: prods,
        pageTitle: "All Products",
        path: "/",
      });
    })
    .catch((err) => console.log("Index ERROR"));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((prods) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: prods,
      });
    })
    .catch((err) => console.log("GetERROR", err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };

exports.postCart = (req, res, next) => {
  const proID = req.body.productID;
  Product.findById(proID)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("POSTCART", result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

//Delete item
exports.deleteCartItem = (req, res, next) => {
  const proID = req.body.productID;
  req.user
    .deleteCartItem(proID)
    .then((result) => {
      console.log("Result", result);
      res.redirect("/cart");
    })
    .catch((err) => console.log("DeleteCartItem", err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
