const pageTitle = "About";
const pagePath = "/about";
const bannerPath = "/data/imgs/";

const query = require("../utils/db");
const mainParams = require("../utils/params");

const params = mainParams(
  `${pageTitle}`,
  `${pagePath}`,
  [
    ["Founder"],
    ["Vision, Mission and Values"],
    ["Leadership"],
    ["Organisation Chart"],
    ["Institutional Committees"],
    ["Institutional Clubs"],
    ["Accreditation", "NAAC", "SSR", "Quality Profile"],
    [
      "Quality Assurance",
      "About IQAC",
      "IQAC Composition",
      "Minutes of Meeting 2022-23",
      "Code of Conduct",
      "Divyangjan",
      "Green Campus Policy",
      "Gender Sensitization Plan",
      "AQAR 2022-23",
    ],
    ["About IMT"],
    ["College Events"],
    ["Contacts"],
    ["College Directory"],
    ["Contact Us"],
    ["Feedback"],
    ["Grievance"],
  ],
  [
    [`${pagePath}/founder`],
    [`${pagePath}/vision-mission-and-values`],
    [`${pagePath}/leadership`],
    [`${pagePath}/organisational-chart`],
    [`${pagePath}/institutional-committees`],
    [`${pagePath}/institutional-clubs`],
    [
      `${pagePath}/accreditations`,
      `${pagePath}/accreditations/naac`,
      `${pagePath}/accreditations/ssr`,
      `${pagePath}/accreditations/quality-profile`,
    ],
    [
      `${pagePath}/quality-assurance/`,
      `${pagePath}/quality-assurance/about`,
      `${pagePath}/quality-assurance/composition`,
      `${pagePath}/quality-assurance/mom-22-23`,
      `${pagePath}/quality-assurance/code-of-conduct`,
      `${pagePath}/quality-assurance/divyangjan`,
      `${pagePath}/quality-assurance/green-campus-policy`,
      `${pagePath}/quality-assurance/gender-sensitization-plan`,
      `/aqar-22-23`,
    ],
    [`${pagePath}/imt`],
    ["/events"],
    ["/about/contact"],
    ["/about/directory"],
    ["/about/contact-us"],
    ["/about/feedback"],
    ["/about/grievance"],
  ]
);

exports.getAbout = (req, res, next) => {
  res.render(
    "about/about",
    Object.assign(
      params(
        `IITM - ${pageTitle}`,
        "/",
        "/data/collegeImgs/college-1.png",
        '"Empowering students to thrive in their careers through transformative education at IITM hello world"'
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getFounder = (req, res, next) => {
  res.render(
    "about/founder",
    Object.assign(
      params(
        "History - Founder",
        "/founder",
        `${bannerPath}college-banner.png`,
        ""
      ),
      {
        isAuthenticated: req.session.isLoggedIn,
      }
    )
  );
};

exports.getVMV = (req, res, next) => {
  res.render(
    "about/vision-mission-and-values",
    Object.assign(
      params(
        `${pageTitle} - Vision, Mission and Values`,
        "/vision-mission-and-values",
        "/data/imgs/vision-mission-and-values-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getLeadership = (req, res, next) => {
  res.render(
    "about/leadership",
    Object.assign(
      params(
        `${pageTitle} - Leadership`,
        "/leadership",
        `${bannerPath}leadership-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getOrganisationalChart = (req, res, next) => {
  res.render(
    "about/organisational-chart",
    Object.assign(
      params(
        `${pageTitle} - Organisational Chart`,
        "/organisational-chart",
        `${bannerPath}org-chart-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getInstitutionalCommittees = (req, res, next) => {
  res.render(
    "about/institutional-committees",
    Object.assign(
      params(
        `${pageTitle} - Institutional Committees`,
        "/institutional-committees",
        `${bannerPath}institutional-committees-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getInstitutionalClubs = (req, res, next) => {
  res.render(
    "about/institutional-clubs",
    Object.assign(
      params(
        `${pageTitle} - Institutional Clubs`,
        "/institutional-clubs",
        "/data/imgs/institutional-clubs-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getAccreditations = (req, res, next) => {
  res.render(
    "about/accreditations",
    Object.assign(
      params(
        `${pageTitle} - Accreditations`,
        "/accreditations",
        `${bannerPath}accreditations-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getNAACAccreditation = (req, res, next) => {
  res.render(
    "about/naac",
    Object.assign(
      params(
        "Accreditations - NAAC",
        "/accreditations/naac",
        `${bannerPath}accreditations-banner.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getSSR = (req, res, next) => {
  res.render(
    "about/ssr",
    Object.assign(
      params(
        `SSR Report`,
        "/accreditations/ssr",
        `${bannerPath}ssr-report.jpg`,
        ""
      ),
      {
        isAuthenticated: req.session.isLoggedIn,
      }
    )
  );
};
exports.getQualityProfile = (req, res, next) => {
  res.render(
    "about/quality-profile",
    Object.assign(
      params(
        `Quality Profile`,
        "/accreditations/quality-profile",
        `${bannerPath}quality-profile.jpg`,
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getQualityAssurance = (req, res, next) => {
  res.render(
    "about/quality-assurance",
    Object.assign(
      params(
        `Quality Assurance`,
        "/quality-assurance/",
        "/data/imgs/quality-assurance-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getAboutIQAC = (req, res, next) => {
  res.render(
    "about/about-iqac",
    Object.assign(
      params(
        `About IQAC`,
        "/quality-assurance/about",
        "/data/imgs/about-iqac.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getComposition = (req, res, next) => {
  res.render(
    "about/iqac-composition",
    Object.assign(
      params(
        `IQAC Composition`,
        "/quality-assurance/composition",
        "/data/imgs/iqac-composition.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getMOM2223 = (req, res, next) => {
  res.render(
    "about/mom-22-23",
    Object.assign(
      params(
        `Minutes of Meeting - 2022-2023`,
        "/quality-assurance/mom-22-23",
        "/data/imgs/iqac-composition.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCodeOfConduct = (req, res, next) => {
  res.render(
    "about/code-of-conduct",
    Object.assign(
      params(
        `Code of Conduct`,
        "/quality-assurance/code-of-conduct",
        "/data/imgs/iqac-composition.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getDivyangjan = (req, res, next) => {
  res.render(
    "about/divyangjan",
    Object.assign(
      params(
        `Divyangjan`,
        "/quality-assurance/divyangjan",
        "/data/imgs/iqac-composition.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getGreenCampusPolicy = (req, res, next) => {
  res.render(
    "about/green-campus-policy",
    Object.assign(
      params(
        `Green Campus Policy`,
        "/quality-assurance/green-campus-policy",
        "/data/imgs/iqac-composition.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getGenderSensitizationPlan = (req, res, next) => {
  res.render(
    "about/gender-sensitization-plan",
    Object.assign(
      params(
        `Gender Sensitization Plan`,
        "/quality-assurance/gender-sensitization-plan",
        "/data/imgs/iqac-composition.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getIMT = (req, res, next) => {
  res.render(
    "about/imt",
    Object.assign(
      params(
        `${pageTitle} - IMT`,
        "/imt",
        `${bannerPath}college-banner.png`,
        ""
      ),
      {
        isAuthenticated: req.session.isLoggedIn,
      }
    )
  );
};

exports.getContact = (req, res, next) => {
  res.render(
    "about/contact",
    Object.assign(
      params(
        `${pageTitle} - Contact`,
        "/contact",
        "/data/imgs/contacts-banner.jpg",
        "Contacts"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getDirectory = (req, res, next) => {
  const sql = `(SELECT name, email, contact, designation FROM employees) UNION (SELECT name, email, contact, designation FROM teachingFaculty) ORDER BY TRIM(SUBSTRING(name, IF(LEFT(name, 3) IN ('Mr.', 'Ms.'), 4, IF(LEFT(name, 4) = 'Mrs.', 5, 1))))`;

  query(sql, [])
    .then((employees) => {
      res.render(
        "about/directory",
        Object.assign(
          params(
            `${pageTitle} - Directory`,
            "/directory",
            "/data/imgs/directory-banner.jpg",
            ""
          ),
          { employees, isAuthenticated: req.session.isLoggedIn }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't fetch college directory. Try again later!");
    });
};

exports.getContactUs = (req, res, next) => {
  const submitted = req.query.submitted || false;
  const error = req.query.error || false;
  res.render(
    "about/contact-us",
    Object.assign(
      params(
        `${pageTitle} - Contact Us`,
        "/contact-us",
        "/data/imgs/contact-us-banner.jpg",
        "Contact Us"
      ),
      { submitted, error, isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getFeedback = (req, res, next) => {
  const submitted = req.query.submitted || false;
  const error = req.query.error || false;

  res.render(
    "about/feedback",
    Object.assign(
      params(
        `${pageTitle} - Feedback`,
        "/feedback",
        "/data/imgs/feedback-banner.jpg",
        ""
      ),
      { submitted, error, isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getGrievance = (req, res, next) => {
  const submitted = req.query.submitted || false;
  const error = req.query.error || false;

  res.render(
    "about/grievance",
    Object.assign(
      params(
        `${pageTitle} - Grievance`,
        "/grievance",
        "/data/imgs/grievance-banner.jpg",
        "Grievance Redressal"
      ),
      { submitted, error, isAuthenticated: req.session.isLoggedIn }
    )
  );
};
