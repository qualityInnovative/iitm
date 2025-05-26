const query = require("../utils/db");

const bannerImg = "https://picsum.photos/2400";
const pageTitle = "Community";
const pagePath = "/community";

const mainParams = require("../utils/params");

const params = mainParams(`${pageTitle}`, `${pagePath}`, "", "");

// Route to Community
exports.getCommunity = (req, res, next) => {
  res.render(
    "community/community",
    Object.assign(
      params(
        `IITM - ${pageTitle}`,
        "/",
        "/data/imgs/alumni-banner.jpg",
        '"Embracing Our Alumni Legacy, Igniting Future Possibilities"'
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Route to Alumni
exports.getAlumni = (req, res, next) => {
  res.render(
    "community/alumni",
    Object.assign(
      params(
        `${pageTitle} - Alumni`,
        "/",
        "/data/imgs/alumni-banner.jpg",
        '"Embracing Our Alumni Legacy, Igniting Future Possibilities"'
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Route to Videos
exports.getVideos = (req, res, next) => {
  Promise.all([
    query(
      "SELECT * FROM videos WHERE category='campus' ORDER BY date DESC LIMIT 3"
    ),
    query(
      "SELECT * FROM videos WHERE category='event' ORDER BY date DESC LIMIT 3"
    ),
  ])
    .then(([campusVideos, eventVideos]) => {
      res.render(
        "community/videos",
        Object.assign(
          params(
            `${pageTitle} - Videos`,
            "/",
            "/data/imgs/videos-banner.png",
            '"Explore Campus Life and Events Through Engaging Videos."'
          ),
          { campusVideos, eventVideos, isAuthenticated: req.session.isLoggedIn }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't get the videos. Try refreshing the page!");
    });
};

// Route to Campus Videos
exports.getCampusVideos = (req, res, next) => {
  res.render(
    "community/campus-videos",
    Object.assign(
      params(
        `Videos - Campus`,
        "/",
        "/data/imgs/alumni-banner.jpg",
        '"Explore Our Campus Through Engaging Videos"'
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
// Route to fetch campus videos asynchrounously
exports.fetchCampusVideos = (req, res, next) => {
  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);
  query(
    "SELECT * FROM videos WHERE (category = ?) ORDER BY date DESC LIMIT ?, ?",
    ["campus", offset, limit]
  )
    .then((campusVideos) => {
      res.json(campusVideos);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't fetch the videos. Try refreshing!");
    });
};

// Route to Event Videos
exports.getEventVideos = (req, res, next) => {
  res.render(
    "community/event-videos",
    Object.assign(
      params(
        `Videos - Events`,
        "/",
        "/data/imgs/alumni-banner.jpg",
        '"Explore Events Through Engaging Videos"'
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
// Route to fetch event videos asynchrounously
exports.fetchEventVideos = (req, res, next) => {
  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);
  query(
    "SELECT * FROM videos WHERE (category = ?) ORDER BY date DESC LIMIT ?, ?",
    ["event", offset, limit]
  )
    .then((eventVideos) => {
      res.json(eventVideos);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't fetch the videos. Try refreshing!");
    });
};
