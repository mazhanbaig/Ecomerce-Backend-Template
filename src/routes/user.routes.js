const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, changePassword, getAllUsers, deleteUser } = require("../controllers/user.controller");
const { authCheck, adminOnly } = require("../middlewares/auth.middleware");

router.get("/profile", authCheck, getProfile);
router.put("/profile", authCheck, updateProfile);
router.put("/change-password", authCheck, changePassword);
router.get("/", authCheck, adminOnly, getAllUsers);
router.delete("/:id", authCheck, adminOnly, deleteUser);

module.exports = router;