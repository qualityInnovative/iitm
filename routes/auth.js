const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// Authentication routes
router.get("/login", authController.getLogin);
// Route to handle login errors
router.get("/login/:error", authController.getLogin);
router.get("/login/:error/:username", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/cms", authController.CMSRedirect);
router.post("/logout", authController.postLogout);

module.exports = router;
