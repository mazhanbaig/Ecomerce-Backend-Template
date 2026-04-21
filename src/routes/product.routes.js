const express = require("express");
const router = express.Router();
const { createProduct, getProductsByStore, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { authCheck, adminOnly } = require("../middlewares/auth.middleware");

router.get("/", authCheck, getProducts);
router.get("/store/:userId", getProductsByStore);
router.get("/:id", authCheck, getProduct);
router.post("/", authCheck, createProduct);
router.put("/:id", authCheck, updateProduct);
router.delete("/:id", authCheck, deleteProduct);

module.exports = router;