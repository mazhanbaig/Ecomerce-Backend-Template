const Order = require("../models/Order");
const Product = require("../models/Product");
const ResponseObj = require("../utils/ResponseObj");

// POST /api/orders/place
const placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, note } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json(ResponseObj(false, "No items in order", null, "Empty order"));
        }

        // Calculate total & check stock
        let totalPrice = 0;
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json(ResponseObj(false, `Product not found: ${item.product}`, null, "Not found"));
            }
            if (product.stock < item.quantity) {
                return res.status(400).json(ResponseObj(false, `Not enough stock for ${product.name}`, null, "Low stock"));
            }
            totalPrice += product.price * item.quantity;

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            totalPrice,
            note
        });

        res.status(201).json(ResponseObj(true, "Order placed successfully", order));

    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// @route  GET /api/orders/my
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 });

        res.status(200).json(ResponseObj(true, "Orders fetched", orders));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// GET /api/orders/store/:userId (admin only)
const getOrdersByStore = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Find all products by this store user
        const storeProducts = await Product.find({ createdBy: req.params.userId }).select("_id");
        const productIds = storeProducts.map(p => p._id);

        if (productIds.length === 0) {
            return res.status(404).json(ResponseObj(false, "No products found for this store", null, "Not found"));
        }

        // Find orders that contain any of these products
        const query = { "items.product": { $in: productIds } };

        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate("user", "name email")
            .populate("items.product", "name price")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json(ResponseObj(true, "Store orders fetched", {
            orders,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        }));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// @route  GET /api/orders/:id
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.product", "name price images")
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json(ResponseObj(false, "Order not found", null, "Not found"));
        }

        // Only owner or admin can view
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json(ResponseObj(false, "Not authorized", null, "Forbidden"));
        }

        res.status(200).json(ResponseObj(true, "Order fetched", order));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// @route  PUT /api/orders/:id/status  (admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json(ResponseObj(false, "Order not found", null, "Not found"));
        }

        res.status(200).json(ResponseObj(true, "Order status updated", order));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// @route  PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json(ResponseObj(false, "Order not found", null, "Not found"));
        }

        // Only owner can cancel
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json(ResponseObj(false, "Not authorized", null, "Forbidden"));
        }

        if (order.orderStatus !== "processing") {
            return res.status(400).json(ResponseObj(false, "Cannot cancel this order", null, "Already shipped or delivered"));
        }

        // Restore stock
        for (let item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        order.orderStatus = "cancelled";
        await order.save();

        res.status(200).json(ResponseObj(true, "Order cancelled", order));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// @route  GET /api/orders  (admin only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name price")
            .sort({ createdAt: -1 });

        res.status(200).json(ResponseObj(true, "All orders fetched", orders));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

module.exports = { placeOrder, getMyOrders, getOrder, updateOrderStatus, cancelOrder, getAllOrders, getOrdersByStore };
