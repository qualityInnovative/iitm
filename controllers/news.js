const query = require("../utils/db");
const pageTitle = "News";
const pagePath = "/community/news";

const mainParams = require("../utils/params");

const params = mainParams(`${pageTitle}`, `${pagePath}`, "", "");

const sanitizeHtml = require("sanitize-html");

// Renders news page with the latest news
exports.getNews = (req, res, next) => {
  Promise.all([
    query("SELECT * FROM news ORDER BY DATE DESC LIMIT 1"),
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([result, user]) => {
      // Sanitizes the html of news
      result.forEach((res) => {
        sanitizeHtml(res.news);
      });

      // Renders the view
      res.render(
        "news/news.pug",
        Object.assign(params(`IITM - ${pageTitle}`, `${pagePath}`, "", ""), {
          news: result,
          isNewsAdmin:
            user[0]?.username == "admin@cms" ||
            user[0]?.username == "hod@cs" ||
            user[0]?.username == "hod@ms" ||
            user[0]?.username == "coordinator@cs" ||
            user[0]?.username == "coordinator@ms" ||
            user[0]?.username == "po@iitm" ||
            user[0]?.username == "pro@iitm" ||
            user[0]?.username == "director@iitm"
              ? req.session.isLoggedIn
              : false,
          isAuthenticated: req.session.isLoggedIn,
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't fetch news. Try again!");
    });
};

// Function that is asynchronously called by client-side to fetch news items for news sidebar
exports.fetchNews = (req, res, next) => {
  // Collecting data send by client side
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  // Fetches the news from database
  query(`SELECT nid, headline, date FROM news ORDER BY DATE DESC LIMIT ?, ?`, [
    offset,
    limit,
  ])
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Function to display a particular news, based on id
exports.getNewsByID = (req, res, next) => {
  // Collecting data
  const nid = req.params.nid;

  const sql = "SELECT * FROM news WHERE(nid = ?)";

  Promise.all([
    query(sql, [nid]),
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([result, user]) => {
      // Render the news view
      res.render(
        "news/news.pug",
        Object.assign(params(`IITM - ${pageTitle}`, "/news", "", ""), {
          news: result,
          isNewsAdmin:
            user[0]?.username == "admin@news" ||
            user[0]?.username == "admin@cms"
              ? req.session.isLoggedIn
              : false,
          isAuthenticated: req.session.isLoggedIn,
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't fetch news. Try again!");
    });
};
