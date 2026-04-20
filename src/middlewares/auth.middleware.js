const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ResponseObj = require("../utils/ResponseObj");

const authCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json(ResponseObj(false, "Not authorized, no token", null, "Unauthorized"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();

    } catch (err) {
        res.status(401).json(ResponseObj(false, "Token invalid or expired", null, err.message));
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json(ResponseObj(false, "Admin access only", null, "Forbidden"));
    }
};

module.exports = { authCheck, adminOnly };