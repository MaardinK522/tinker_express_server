const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Index page of the Tinker Bolt." });
});

router.get("/home_page", function (req, res, next) {
  res.render("home_page");
});

module.exports = router;
