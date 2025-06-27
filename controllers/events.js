const query = require("../utils/db");
const pageTitle = "Events";
const pagePath = "/events";

const bannerImg = "/data/imgs/events-banner.jpg";

const mainParams = require("../utils/params");
const params = mainParams(`${pageTitle}`, `${pagePath}`, "", "");

const sanitizeHtml = require("sanitize-html");

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

// Fetches first 5 events and top3 events and render /events
exports.getEvents = (req, res, next) => {
  Promise.all([
    query("SELECT * FROM events ORDER BY start DESC LIMIT 0, 5"),
    query(
      "SELECT * FROM (SELECT * FROM events ORDER BY start DESC limit 0, 3) AS subquery ORDER BY start ASC"
    ),
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([events, top3, user]) => {
      sanitizeAndFormateDate(events);
      sanitizeAndFormateDate(top3);

      // Render the view
      res.render(
        "events/events",
        Object.assign(
          params(`${pageTitle}`, `${pagePath}`, bannerImg, "Events"),
          {
            events,
            top3,
            isEventsAdmin:
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
          }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Asynchronous route to fetch events on loadmore click
exports.fetchEvents = (req, res, next) => {
  // Collecting data send by client side
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);

  // Fetches the events from database
  query(`SELECT * FROM events ORDER BY start DESC LIMIT ?, ?`, [offset, limit])
    .then((events) => {
      sanitizeAndFormateDate(events);

      res.json(events);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Fetches all events of a particular date and top3 and render /events
exports.getEventsByDate = (req, res, next) => {
  const date = req.params.date;

  Promise.all([
    query("SELECT * FROM events WHERE DATE(start) = ? ORDER BY start", [date]),
    query(
      "SELECT * FROM (SELECT * FROM events ORDER BY start DESC limit 0, 3) AS subquery ORDER BY start ASC"
    ),
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([events, top3, user]) => {
      sanitizeAndFormateDate(events);
      sanitizeAndFormateDate(top3);

      // Render the view
      res.render(
        "events/events",
        Object.assign(
          params(
            `${pageTitle} - ${date}`,
            `${pagePath}`,
            `${bannerImg}`,
            `Events on ${new Date(date).toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}`
          ),
          {
            events,
            top3,
            isEventsAdmin:
              user[0]?.username == "admin@events" ||
                user[0]?.username == "admin@cms"
                ? req.session.isLoggedIn
                : false,
            isAuthenticated: req.session.isLoggedIn,
            hideLoadMore: true,
            date,
          }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Fetches details of a particular event and top3 events and render /events
exports.getEventById = (req, res, next) => {
  const eventID = req.params.id;

  Promise.all([
    query("SELECT * FROM events WHERE eid = ?", [eventID]),
    query(
      "SELECT * FROM (SELECT * FROM events ORDER BY start DESC limit 0, 3) AS subquery ORDER BY start ASC "
    ),
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([event, top3, user]) => {
      if (!event || event.length === 0) {
        return res.status(404).send("Event not found");
      }

      sanitizeAndFormateDate(event);
      sanitizeAndFormateDate(top3);
      res.render(
        "events/events",
        Object.assign(
          params(
            `Event - ${event[0].event
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}`,
            `${pagePath}`,
            bannerImg,
            `${event[0].event}`
          ),
          {
            event,
            top3,
            isEventsAdmin:
              user[0]?.username == "admin@events" ||
                user[0]?.username == "admin@cms"
                ? req.session.isLoggedIn
                : false,
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

// Fetches all events of the current month and top3 events and render /events
exports.getEventsOfCurrentMonth = (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  Promise.all([
    query(
      "SELECT * FROM events WHERE YEAR(start) = ? AND MONTH(start) = ? ORDER BY start",
      [currentYear, currentMonth]
    ),
    query(
      "SELECT * FROM (SELECT * FROM events ORDER BY start DESC limit 0, 3) AS subquery ORDER BY start ASC"
    ),
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([events, top3, user]) => {
      sanitizeAndFormateDate(events);
      sanitizeAndFormateDate(top3);

      // Render the view
      res.render(
        "events/events",
        Object.assign(
          params(
            `${pageTitle} - This Month`,
            `${pagePath}`,
            bannerImg,
            `Events This Month`
          ),
          {
            events,
            top3,
            isEventsAdmin:
              user[0]?.username == "admin@events" ||
                user[0]?.username == "admin@cms"
                ? req.session.isLoggedIn
                : false,
            isAuthenticated: req.session.isLoggedIn,
            hideLoadMore: true,
            titles: "Events This Month",
          }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Fetches all events of next month and top3 events and render /events
exports.getEventsOfNextMonth = (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  let nextMonth = currentMonth + 1;
  let nextYear = currentYear;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear++;
  }

  Promise.all([
    query("SELECT * FROM events WHERE YEAR(start) = ? AND MONTH(start) = ?", [
      nextYear,
      nextMonth,
    ]),
    query(
      "SELECT * FROM (SELECT * FROM events ORDER BY start DESC limit 0, 3) AS subquery ORDER BY start ASC"
    ),
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([events, top3, user]) => {
      sanitizeAndFormateDate(events);
      sanitizeAndFormateDate(top3);

      // Render the view
      res.render(
        "events/events",
        Object.assign(
          params(
            `${pageTitle} - Next Month`,
            `${pagePath}`,
            bannerImg,
            `Events Next Month`
          ),
          {
            events,
            top3,
            isEventsAdmin:
              user[0]?.username == "admin@events" ||
                user[0]?.username == "admin@cms"
                ? req.session.isLoggedIn
                : false,
            isAuthenticated: req.session.isLoggedIn,
            hideLoadMore: true,
            titles: "Events Next Month",
          }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Fetches all events of a particular month and top3 events and render /events
exports.getEventsByMonth = (req, res, next) => {
  const monthAndYear = req.params.mmyyyy;
  const month = parseInt(monthAndYear.split("-")[0]);
  const year = parseInt(monthAndYear.split("-")[1]);
  const monthArr = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  Promise.all([
    query(
      "SELECT * FROM events WHERE YEAR(start) = ? AND MONTH(start) = ? ORDER BY start",
      [year, month]
    ),
    query(
      "SELECT * FROM (SELECT * FROM events ORDER BY start DESC limit 0, 3) AS subquery ORDER BY start ASC"
    ),
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([events, top3, user]) => {
      sanitizeAndFormateDate(events);
      sanitizeAndFormateDate(top3);
      // Render the view
      res.render(
        "events/events",
        Object.assign(
          params(
            `${pageTitle} - ${monthArr[month - 1]
              .charAt(0)
              .toUpperCase()}${monthArr[month - 1].slice(1)}, ${year}`,
            `${pagePath}`,
            bannerImg,
            `Events in ${monthArr[month - 1]}, ${year}`
          ),
          {
            events,
            top3,
            isEventsAdmin:
              user[0]?.username == "admin@events" ||
                user[0]?.username == "admin@cms"
                ? req.session.isLoggedIn
                : false,
            isAuthenticated: req.session.isLoggedIn,
            hideLoadMore: true,
          }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
