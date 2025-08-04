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
      "SELECT faculty_id, profile_image , full_name as name, " +
      "position as appointedAs, department, experience, specialization, " +
      "education as qualification, resume_path as resume " +
      "FROM faculty WHERE department = 'placement_officer' AND is_active = 1 " +
      "ORDER BY `order`, full_name"
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

exports.deletePlacementDriveHighlight = (req, res, next) => {
  // Check admin privileges first
  
  const { id } = req.body;
  
  // Validate ID
  if (!id) {
    return res.status(400).json({ 
      success: false, 
      message: "ID is required" 
    });
  }

  // First delete the record
  query("DELETE FROM placementDriveHighlights WHERE pid = ?", [id])
    .then(result => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Item not found" 
        });
      }

      // After successful deletion, fetch updated data
      return Promise.all([
        query("SELECT * FROM placementTestimonials ORDER BY date DESC"),
        query(
          "SELECT * FROM placementDriveHighlights WHERE YEAR(date) IN (YEAR(CURDATE()), YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))) ORDER BY date DESC"
        ),
        query(
          "SELECT faculty_id, profile_image, full_name as name, " +
          "position as appointedAs, department, experience, specialization, " +
          "education as qualification, resume_path as resume " +
          "FROM faculty WHERE department = 'placement_officer' AND is_active = 1 " +
          "ORDER BY `order`, full_name"
        )
      ]);
    })
    .then(([placementTestimonials, placementDriveHighlights, placementFaculty]) => {
      // Return JSON response with updated data
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
    })
    .catch(err => {
      console.error("Delete error:", err);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete item",
        error: err.message 
      });
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

