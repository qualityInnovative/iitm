const pageTitle = "Campus";
const pagePath = "/campus";

const query = require("../utils/db");

const mainParams = require("../utils/params");

const params = mainParams(
  `${pageTitle}`,
  `${pagePath}`,
  [["Canteen"],["Virtual Campus Tour"], ["Sports Facilities"], ["Transportation Services"], ["Hostel"]],
  [
    [`${pagePath}/canteen`],
    [`${pagePath}/virtual-tour`],
    [`${pagePath}/sports`],
    [`${pagePath}/transportation`],
    [`${pagePath}/hostel`],
  ]
);

exports.getVirtualTour = (req, res, next) => {
  res.render(
    `campus/virtual-tour`,
    params(
      `${pageTitle} - Virtual Tour`,
      `/virtual-tour`,
      "/data/imgs/virtual-tour-banner.jpg",
      ""
    )
  );
}

exports.getCampus = (req, res, next) => {
  res.render(
    `campus/campus`,
    params(`IITM - ${pageTitle}`, `/`, "/data/collegeImgs/college-1.png", "")
  );
};

// Route to Canteen
exports.getCanteen = (req, res, next) => {
  res.render(
    `campus/canteen`,
    params(
      `${pageTitle} - Canteen`,
      `/canteen`,
      "/data/imgs/canteen-banner.jpg",
      ""
    )
  );
};

// Route to guest lectures
exports.getSports = (req, res, next) => {
  // Fetches details of sports faculty from db
  query(
    "SELECT name, gender, photograph, qualification, experience, specialization, appointedAs, department, resume FROM ?? WHERE (department = 'sports') ORDER BY name",
    ["teachingFaculty"]
  )
    .then((result) => {
      // Renders the view
      res.render(
        `campus/sports`,
        Object.assign(
          params(
            `${pageTitle} - Sports`,
            `/sports`,
            "/data/collegeImgs/sports.JPG",
            ""
          ),
          { sportsFaculty: result, isAuthenticated: req.session.isLoggedIn }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Route to Transportation
exports.getTransportation = (req, res, next) => {
  res.render(
    `campus/transportation`,
    params(
      `${pageTitle} - Transportation`,
      `/transportation`,
      "/data/imgs/transportation-banner.jpg",
      ""
    )
  );
};

// Route to Hostel
exports.getHostel = (req, res, next) => {
  res.render(
    `campus/hostel`,
    params(
      `${pageTitle} - Hostel`,
      `/hostel`,
      "/data/imgs/hostel-banner.jpg",
      ""
    )
  );
};
