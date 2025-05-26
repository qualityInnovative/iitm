const query = require("../utils/db");
const pageTitle = "Notifications";
const pagePath = "/notifications";

const bannerImg = "/data/imgs/notifications-banner.jpg";

const mainParams = require("../utils/params");
const params = mainParams(`${pageTitle}`, `${pagePath}`, "", "");

// Fetches notification for the first time page loads
exports.getNotifications = (req, res, next) => {
  query("SELECT * FROM notifications ORDER BY DATE DESC")
    .then((result) => {
      res.render(
        "notifications/notifications",
        Object.assign(
          params(
            `IITM - ${pageTitle}`,
            `${pagePath}`,
            bannerImg,
            "Browse Notifications"
          ),
          {
            notifications: result,
            isAuthenticated: req.session.isLoggedIn,
          }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

exports.getNotificationById = (req, res, next) => {
  const id = req.params.id;

  query("SELECT * FROM notifications WHERE nid = ?", [id])
    .then((result) => {
      if (result.length == 0) {
        res.status(404).send("Not Found");
      } else {
        res.render(
          "notifications/notification",
          Object.assign(
            params(
              `IITM - ${pageTitle}`,
              `${pagePath}`,
              bannerImg,
              `${new Date(result[0].date).toLocaleString('en-US', {day: 'numeric', month: 'short', year: 'numeric'})}`
            ),
            {
              notification: result[0],
              isAuthenticated: req.session.isLoggedIn,
            }
          )
        );
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// This funciton is called asynchronously by client side to fetch notifications on scroll
exports.fetchNotifications = (req, res, next) => {
  // Collecting data send by client side
  const limit = parseInt(req.query.limit) || 25;
  const offset = parseInt(req.query.offset) || 0;

  const category = req.query.category;

  let sql = "SELECT * FROM notifications ORDER BY DATE DESC LIMIT ?, ?";
  let queryPlaceholders = [offset, limit];

  if (category != -1) {
    sql =
      "SELECT * FROM notifications WHERE (category = ?) ORDER BY DATE DESC LIMIT ?, ?";
    queryPlaceholders = [category, offset, limit];
  }

  query(sql, queryPlaceholders)
    .then((notifications) => {
      res.json(notifications);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
