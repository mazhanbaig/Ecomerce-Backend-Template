const Product = require("../models/Product");
const ResponseObj = require("../utils/ResponseObj");

// Create product
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(ResponseObj(true, "Product created", product));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// Get all products with pagination & filters
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;

        const query = { isActive: true };

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: "i" };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json(ResponseObj(true, "Products fetched", {
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        }));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json(ResponseObj(false, "Product not found", null, "Not found"));
        }
        res.status(200).json(ResponseObj(true, "Product fetched", product));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json(ResponseObj(false, "Product not found", null, "Not found"));
        }
        res.status(200).json(ResponseObj(true, "Product updated", product));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json(ResponseObj(false, "Product not found", null, "Not found"));
        }
        res.status(200).json(ResponseObj(true, "Product deleted", null));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };