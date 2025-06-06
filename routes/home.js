const express = require("express");
const sanitizeHtml = require("sanitize-html");
const query = require("../utils/db");

const router = express.Router();

// Function to format date into desired format
const formateDate = (date) => {
  var dayOfWeek = date.toLocaleString("en-US", { weekday: "short" });
  var dayOfMonth = date.toLocaleString("en-US", { day: "2-digit" });
  var month = date.toLocaleString("en-US", { month: "short" });
  var year = date.toLocaleString("en-US", { year: "numeric" });
  var hours = date.getHours() % 12 || 12;
  var minutes = date.toLocaleString("en-US", { minute: "numeric" });
  var ampm = date.getHours() < 12 ? "AM" : "PM";
  return (
    dayOfWeek +
    " " +
    dayOfMonth +
    " " +
    month +
    " " +
    year +
    " @ " +
    hours +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes +
    " " +
    ampm
  );
};

// Sanitizes the HTML and formats start and end dates
const sanitizeAndFormateDate = (events) => {
  // Sanitizing the html
  events.forEach((event) => {
    sanitizeHtml(event.description, {
      allowedTags: [],
      allowedAttributes: {},
    });
  });

  // Formates start and end dates
  events.forEach((event) => {
    event.start = formateDate(new Date(event.start));
    event.end = formateDate(new Date(event.end));
  });
};

const homeController = (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Fetching gallery, homeButtons, first three news form database, images of carousel, events of current month and notifications of recent 3 days.
  Promise.all([
    query("SELECT * FROM gallery"),
    query("SELECT * FROM homeButtons"),
    query("SELECT * FROM news ORDER BY date DESC LIMIT 3"),
    query("SELECT * FROM homeCarousel ORDER BY date DESC"),
    query(
      "SELECT * FROM events WHERE YEAR(start) = ? AND MONTH(start)  = ? AND start >= CURDATE() ORDER BY start LIMIT 5",
      [currentYear, currentMonth]
    ),
    query("SELECT * FROM placementTestimonials ORDER BY date DESC LIMIT 10"),
    query("SELECT * FROM notifications ORDER BY date DESC LIMIT 5"),
    query(`
      SELECT text, url, title 
      FROM marquee_links 
      WHERE is_active = 1 
        AND (start_date IS NULL OR start_date <= NOW()) 
        AND (end_date IS NULL OR end_date >= NOW())
      ORDER BY priority ASC
    `),
    query("SELECT * FROM visionaries WHERE is_active = 1 ORDER BY priority ASC"),
    query("SELECT * FROM statistics WHERE is_active = 1 AND year = ? ORDER BY category, priority", [currentYear-1 ]),
    query("SELECT * FROM banners WHERE is_active = 1 ORDER BY priority ASC")

  ])
    .then(
      ([
        gallery,
        homeButtons,
        news,
        homeCarousel,
        events,
        testimonials,
        notifications,
        marqueeLinks,
        visionaries,
        statistics,
        banners

      ]) => {
        // Sanitize Events and formate start and end dates
        sanitizeAndFormateDate(events);

        // Sanitizes html of news that is fetched from database to remove all html tags.(We only want to show plan text in news card)
        news.forEach((news) => {
          news.news = sanitizeHtml(news.news, {
            allowedTags: [],
            allowedAttributes: {},
          });
        });
        const statsByCategory = {
          overview: [],
          academic: [],
          campus: [],
          student: []
        };

        statistics.forEach(stat => {
          statsByCategory[stat.category].push(stat);
        });
      
        res.render("home", {
          pageTitle: "IITM - Home",
          path: "/",
          gallery,
          buttons: homeButtons,
          news,
          homeCarousel,
          events,
          notifications,
          testimonials,
          marqueeLinks,
          visionaries,
          statistics: statsByCategory,
          statsYear: currentYear - 1,
          banners,
          isAuthenticated: req.session.isLoggedIn,
        });
       
      }
    )
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Route to /
router.get("/", homeController);

// Route to /home
router.get("/home", homeController);

module.exports = router;
