const pageTitle = "Programmes Offered";
const pagePath = "/admissions";
const bannerPath = "/data/imgs/";
const query = require("../utils/db");
const mainParams = require("../utils/params");

const params = mainParams(
  `${pageTitle}`,
  `${pagePath}`,
  [
    ["Graduate programmes"],
    ["Post Graduate programmes"],
    ["Tution & Fees"],
    ["Scholarships", "STEM Scholarship", "Sakhawat Center"],
    ["Rules and Regulations"],
    ["FAQ"],
    
    
  ],
  [
    [`${pagePath}/ug-admissions`],
    [`${pagePath}/pg-admissions`],
    [`${pagePath}/tution-and-fees`],
    [
      `${pagePath}/scholarships`,
      `${pagePath}/scholarships/stem`,
      `${pagePath}/scholarships/sakhawat-centre`,
    ],
    [`${pagePath}/rules-and-regulations`],
    [`${pagePath}/faq`],
    
    
  ]
);

exports.getTutionAndFees = async (req, res, next) => {
  try {
    const courses = await query(`
      SELECT * FROM courses 
      WHERE is_active = 1 
      ORDER BY priority
    `);

    res.render(
      "admissions/tution-and-fees",
      Object.assign(
        params(
          `${pageTitle} - Tution and Fees`,
          `/tution-and-fees`,
          `${bannerPath}tution-and-fees-banner.jpg`,
          ""
        ),
        {
          isAuthenticated: req.session.isLoggedIn,
          courses
        }
      )
    );
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.render(
      "admissions/tution-and-fees",
      Object.assign(
        params(
          `${pageTitle} - Tution and Fees`,
          `/tution-and-fees`,
          `${bannerPath}tution-and-fees-banner.jpg`,
          ""
        ),
        {
          isAuthenticated: req.session.isLoggedIn,
          courses: [] // fallback empty array
        }
      )
    );
  }
};


exports.getFaq = (req, res, next) => {
  res.render(
    "admissions/faq",
    Object.assign(
      params(
        `IITM - ${pageTitle} - FAQ`,
        `${pagePath}/faq`,
        // `${bannerPath}faq-banner.jpg`,
        '"Frequently Asked Questions"'
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
}

//? ADMISSIONS
exports.getAdmissions = (req, res, next) => {
  res.render(
    "admissions/admissions",
    Object.assign(
      params(
        `IITM - ${pageTitle}`,
        `/`,
        `${bannerPath}admissions-banner.jpg`,
        '"Embark on Your Journey to Success with Us"'
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getUGAdmissions = (req, res, next) => {
  res.render(
    "admissions/ug-admissions",
    Object.assign(
      params(
        `IITM - UG Admissions`,
        `/ug-admissions`,
        `${bannerPath}ug-admissions-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getPGAdmissions = (req, res, next) => {
  res.render(
    "admissions/pg-admissions",
    Object.assign(
      params(
        `IITM - PG Admissions`,
        `/pg-admissions`,
        `${bannerPath}pg-admissions-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// exports.getTutionAndFees = (req, res, next) => {
//   res.render(
//     "admissions/tution-and-fees",
//     Object.assign(
//       params(
//         `${pageTitle} - Tution and Fees`,
//         `/tution-and-fees`,
//         `${bannerPath}tution-and-fees-banner.jpg`,
//         ""
//       ),
//       { isAuthenticated: req.session.isLoggedIn }
//     )
//   );
// };


exports.getRulesAndRegulations = (req, res, next) => {
  res.render(
    "admissions/rules-and-regulations",
    Object.assign(
      params(
        `${pageTitle} - Rules and Regulations`,
        `/rules-and-regulations`,
        `${bannerPath}rules-and-regulations-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? Scholarship Rotues
exports.getScholarships = (req, res, next) => {
  res.render(
    "admissions/scholarships",
    Object.assign(
      params(`${pageTitle} - Scholarships`, `/scholarships`, `${bannerPath}scholarships-banner.png`, ""),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getStem = (req, res, next) => {
  res.render(
    "admissions/stem-scholarship",
    Object.assign(
      params(`Scholarships - STEM`, `/scholarships/stem`, `${bannerPath}scholarships-banner.png`, ""),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getSakhawatCentre = (req, res, next) => {
  res.render(
    "admissions/sakhawat-centre",
    Object.assign(
      params(
        `Scholarships - Sakhawat Centre`,
        `/scholarships/sakhawat-centre`,
        `${bannerPath}scholarships-banner.png`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// NOTE: Scholarships to be added

// New Admission
exports.getNewAdmission = (req, res, next) => {
  const submitted = req.query.submitted || false;
  const error = req.query.error || false;
  res.render(
    "admissions/new-admission",
    Object.assign(
      params(
        `Admission - New Admission`,
        `/`,
        "/data/imgs/new-admission-banner.jpg",
        '"Take the First Step, Submit Your Admission Inquiry Now!"'
      ),
      { submitted, error, isAuthenticated: req.session.isLoggedIn }
    )
  );
};
