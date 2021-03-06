const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.deleteCartItem);

router.get("/orders", shopController.getOrders);

// // router.get("/checkout", shopController.getCheckout);

// //handle details, :__ can be anything, dynamic path should be put last
router.get("/products/:productID", shopController.getProductDetail);

router.post("/create-order", shopController.postOrder);

module.exports = router;
