const express = require("express");
const router = express.Router();
const {
    placeOrder,
    getMyOrders,
    getOrder,
    getOrdersByStore,
    updateOrderStatus,
    cancelOrder,
    getAllOrders
} = require("../controllers/order.controller");
const { authCheck, adminOnly } = require("../middlewares/auth.middleware");

router.post("/place", authCheck, placeOrder);
router.get("/my", authCheck, getMyOrders);
router.get("/", authCheck, adminOnly, getAllOrders);
router.get("/store/:userId", authCheck, adminOnly, getOrdersByStore);
router.get("/:id", authCheck, getOrder);
router.put("/:id/update/status", authCheck, adminOnly, updateOrderStatus);
router.put("/:id/cancel", authCheck, cancelOrder);

module.exports = router; 