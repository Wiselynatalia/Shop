const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  console.log("GETEDIT!");
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productID = req.params.productID;
  Product.findById(productID).then((product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    description: description,
    price: price,
    imageURL: imageUrl,
    userID: req.user._id,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  // const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  // const price = req.body.price;
  // const description = req.body.description;
  // const proID = req.body.productID;

  const { title, imageUrl, price, description, productID } = req.body;

  Product.updateOne(
    { _id: productID },
    {
      title: title,
      description: description,
      price: price,
      imageURL: imageUrl,
    }
  )
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const proID = req.body.productID;
  Product.deleteOne({ _id: proID })
    .then((result) => {
      console.log("Destroyed!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log("error", err));
};
