const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const sequalize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//after sql is initialised
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log("err"));
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//create associations, cascade-> passed on: delete user = delete product
//belongsTo: many to many hasMany: one to many
//belongsToMany need through property
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Cart.belongsToMany(Product, { through: CartItem });

//sync models into database by creating the appropriate tables

//force, always ask to overwrite
sequalize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Kitty", email: "kit@mail.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log("BOOOOO", cart);
    // const cart = user.getCart();

    // if (!cart) {
    return user.createCart();
    // }
    // return cart;
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("AppJS Error", err);
  });
