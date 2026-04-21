const User = require("../models/User");
const ResponseObj = require("../utils/ResponseObj");
const bcrypt = require("bcryptjs");

// GET /api/users/profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(ResponseObj(true, "Profile fetched", user));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, avatar },
            { new: true }
        ).select("-password");
        res.status(200).json(ResponseObj(true, "Profile updated", user));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// PUT /api/users/change-password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json(ResponseObj(false, "Current password is incorrect", null, "Wrong password"));
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json(ResponseObj(true, "Password changed successfully", null));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// GET /api/users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(ResponseObj(true, "Users fetched", users));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

// DELETE /api/users/:id (admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json(ResponseObj(false, "User not found", null, "Not found"));
        }
        res.status(200).json(ResponseObj(true, "User deleted", null));
    } catch (err) {
        res.status(500).json(ResponseObj(false, "Server error", null, err.message));
    }
};

module.exports = { getProfile, updateProfile, changePassword, getAllUsers, deleteUser };