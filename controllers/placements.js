const pageTitle = "Placements";
const pagePath = "/placements";
const bannerPath = "/data/imgs/";

const query = require("../utils/db");

const mainParams = require("../utils/params");

const params = mainParams(
  `${pageTitle}`,
  `${pagePath}`,
  [/*["Internships"]*/ ["Industrial Visits"], ["MOU's"]],
  [
    // [`${pagePath}/internships`],
    [`${pagePath}/industrial-visits`],
    [`${pagePath}/mous`],
  ]
);

// Routes to placements
exports.getPlacements = (req, res, next) => {
  Promise.all([
    query("SELECT * FROM placementTestimonials ORDER BY date DESC"),
    query(
      "SELECT * FROM placementDriveHighlights WHERE YEAR(date) IN (YEAR(CURDATE()), YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))) ORDER BY date DESC"
    ),
    query(
      "SELECT name, gender, photograph, qualification, experience, specialization, appointedAs, department, resume FROM ?? WHERE (department = 'placement') ORDER BY name",
      ["teachingFaculty"]
    ),
  ])
    .then(
      ([placementTestimonials, placementDriveHighlights, placementFaculty]) => {
        res.render(
          `placements/placements`,
          Object.assign(
            params(
              `IITM - ${pageTitle}`,
              `/`,
              "/data/imgs/placements-banner.jpg",
              `"Discover your potential and accelerate your career with IITM's dynamic placements."`
            ),
            {
              placementTestimonials,
              placementDriveHighlights,
              placementFaculty,
              isAuthenticated: req.session.isLoggedIn,
            }
          )
        );
      }
    )
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Routes to Internships
exports.getInternships = (req, res, next) => {
  res.render(
    `placements/internships`,
    Object.assign(
      params(
        `${pageTitle} - Internships`,
        `/internships`,
        `${bannerPath}/internships-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Routes to industrial visits
exports.getIndustrialVisists = (req, res, next) => {
  query("SELECT * FROM industrialVisits ORDER BY date DESC")
    .then((visits) => {
      res.render(
        `placements/industrial-visits`,
        Object.assign(
          params(
            `${pageTitle} - Industrial Visists`,
            `/industrial-visits`,
            `${bannerPath}industrial-visit-banner.jpg`,
            ""
          ),
          {
            visits,
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

// Routes to Internships
exports.getMOUS = (req, res, next) => {
  res.render(
    `placements/mous`,
    Object.assign(
      params(
        `${pageTitle} - MOU's`,
        `/mous`,
        `${bannerPath}mou-banner.png`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
