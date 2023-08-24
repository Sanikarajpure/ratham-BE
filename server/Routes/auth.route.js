const express = require("express");
const authController = require("../Controllers/auth.controller");
const router = express.Router();

//api/auth/register
router.post("/register", authController.register);

//api/auth/signin
router.post("/signin", authController.signin);

module.exports = router;
