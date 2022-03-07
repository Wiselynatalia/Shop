const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll().then((prods) => {
    res.render("shop/product-list", {
      prods: prods,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  const proID = req.params.productID;
  Product.findByPk(proID)
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
  Product.findAll()
    .then((prods) => {
      res.render("shop/product-list", {
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
    .then((cart) => {
      console.log("Cart", cart);
      return cart
        .getProducts()
        .then((prods) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: prods,
          });
        })
        .catch((err) => console.log("ERR"));
    })
    .catch((err) => console.log("GetERROR", err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.addToCart = (req, res, next) => {
  const proID = req.body.productID;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      //check if product exist in cart
      fetchedCart = cart;
      return cart.getProducts({ where: { id: proID } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let newQty = 1;
      if (product) {
        //cartItem is xtra field added by sequalize to give access to in-between table
        const oldQty = product.cartItem.quantity;
        newQty = oldQty + 1;
        return fetchedCart.addProduct(product, {
          through: { quantity: newQty },
        });
      }
      return Product.findByPk(proID)
        .then((product) => {
          console.log("PRODUCTtoADD", product);
          return fetchedCart.addProduct(product, {
            //values to be inserted to in-between obj
            through: { quantity: newQty },
          });
        })
        .catch((err) => console.log("ADDC", err));
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log("ERR"));
};
//Delete item
exports.deleteCartItem = (req, res, next) => {
  const proID = req.body.productID;
  const price = req.body.price;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: proID } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log("DeleteCartItem", err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        return order.addProduct(
          products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
