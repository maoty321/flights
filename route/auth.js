const express = require("express");
const authRouter = express.Router();
const { register, getregister, getlogin, loginUser } = require("../controller/auth");

authRouter.get("/register", getregister);
authRouter.post("/register", register);

authRouter.get("/login", getlogin);
authRouter.post("/login", loginUser);

module.exports = authRouter;