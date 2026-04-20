const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { authCheck } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authCheck, getMe);

module.exports = router;