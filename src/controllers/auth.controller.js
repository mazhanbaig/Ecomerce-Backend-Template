const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const ResponseObj = require("../utils/ResponseObj");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d"
    });
};

// @route  POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(ResponseObj(false, "Email already registered", null, "Email already exists"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user._id);

        res.status(201).json(ResponseObj(true, "Registered successfully", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }));

    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// @route  POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json(ResponseObj(false, "Invalid credentials", null, "User not found"));
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(ResponseObj(false, "Invalid credentials", null, "Invalid credentials"));
        }


        const token = generateToken(user._id);

        res.status(200).json(ResponseObj(true, "Login successful", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }));

    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// @route  GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(ResponseObj(true, "User fetched", user));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

module.exports = { register, login, getMe };