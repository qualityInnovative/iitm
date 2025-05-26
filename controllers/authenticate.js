const express = require("express");
const router = express.Router();

const query = require("../utils/db");

// This route is accessed asynchronously by client side to check if the user is authenticated or not. This is needed for showing/hiding content for admins/users.(For dynamically created html. Static can be authenticated simply by passing the true/false with render function.)
// Returns true or false
router.get("/authenticate", (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((user) => {
      const isLoggedIn =
        user[0]?.username == "admin@cms" ||
        user[0]?.username == "hod@cs" ||
        user[0]?.username == "hod@ms" ||
        user[0]?.username == "coordinator@cs" ||
        user[0]?.username == "coordinator@ms" ||
        user[0]?.username == "so@iitm" ||
        user[0]?.username == "po@iitm" ||
        user[0]?.username == "pro@iitm" ||
        user[0]?.username == "director@iitm"
          ? req.session.isLoggedIn
          : false;
      res.json(isLoggedIn);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't authenticate user. Try again later!");
    });
});

router.get("/authenticate-videos-admin", (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((user) => {
      const isLoggedIn =
        user[0]?.username == "admin@events" || user[0]?.username == "admin@cms"
          ? req.session.isLoggedIn
          : false;
      res.json(isLoggedIn);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't authenticate user. Try again later!");
    });
});

module.exports = router;
