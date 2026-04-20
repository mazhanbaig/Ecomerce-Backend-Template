const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { authCheck, adminOnly } = require("../middlewares/auth.middleware");

router.get("/", authCheck, getProducts);
router.get("/:id", authCheck, getProduct);
router.post("/", authCheck, createProduct);
router.put("/:id", authCheck, updateProduct);
router.delete("/:id", authCheck, deleteProduct);

module.exports = router;