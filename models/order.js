const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    name: String,
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
