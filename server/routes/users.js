const express = require("express");

const userControllers = require("../controllers/userControllers");
const userAuth = require("../middlewares/auth/userAuth");

const router = express.Router();

router.post("/register", userControllers.register);
router.post("/google-register", userControllers.googleRegister);
router.post("/login", userControllers.login);
router.post("/google-login", userControllers.googleLogin);
router.post(
  "/refresh-token",
  userAuth.refreshToken,
  userControllers.refreshToken
);
router.post("/logout", userAuth.refreshToken, userControllers.logout);

module.exports = router;
