const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find().then((prods) => {
    res.render("shop/product-list", {
      prods: prods,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  console.log("GETDETAIL");
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
  Product.find()
    .then((prods) => {
      res.render("shop/index", {
        prods: prods,
        pageTitle: "All Products",
        path: "/",
      });
    })
    .catch((err) => console.log("Index ERROR"));
};
//get cart takes the product details from user's cart items
//populate() allows referencing documents in other collections
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productID")
    .then((user) => {
      const prods = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: prods,
      });
    })
    .catch((err) => console.log("GetERROR", err));
};

exports.getOrders = (req, res, next) => {
  Order.find()
    .then((orders) => {
      console.log("Orders", orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productID")
    .then((user) => {
      const cartItems = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productID._doc } };
      });
      console.log("CartITEMS", cartItems);
      const order = new Order({
        user: {
          name: req.user.name,
          userID: req.user._id,
        },
        products: cartItems,
      });
      console.log("ORDER", order);
      return order.save();
    })
    .then((res) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    });
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
  console.log("PRO-ID", proID);
  req.user
    .deleteCartItem(proID)
    .then((result) => {
      console.log("Result", result);
      res.redirect("/cart");
    })
    .catch((err) => console.log("DeleteCartItem", err));
};
