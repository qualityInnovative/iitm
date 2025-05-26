const express = require("express");

const router = express.Router();

const newsController = require("../controllers/news");

// NEWS ROUTES
router.get("/news", newsController.getNews);
router.get("/fetch-news", newsController.fetchNews);
router.get("/news/:nid", newsController.getNewsByID);

module.exports = router;
