const express = require("express");
const routerA = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
routerA.post("/register", registerUser);
routerA.post("/login", loginUser);
module.exports = routerA;
