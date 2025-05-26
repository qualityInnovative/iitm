const pageTitle = "Academics";
const pagePath = "/academics";

const query = require("../utils/db");

const mainParams = require("../utils/params");

const params = mainParams(
  `${pageTitle}`,
  `${pagePath}`,
  [
    ["Computer Applications", "BCA", "MCA", "Faculty"],
    ["Management Studies", "BBA", "MBA", "Faculty"],
    ["Labs"],
    ["Guest Lectures"],
    ["Workshops & Bootcamps"],
    ["Institutional Library"],
    ["Academic Calendar"],
    ["Syllabus"],
    ["E-Resources"],
    [
      "Associations",
      "University of Kashmir",
      "AICTE",
      "Dept. of Higher Education",
    ],
  ],
  [
    [
      `${pagePath}/cs`,
      `${pagePath}/cs/bca`,
      `${pagePath}/cs/mca`,
      `${pagePath}/cs/faculty`,
    ],
    [
      `${pagePath}/management`,
      `${pagePath}/management/bba`,
      `${pagePath}/management/mba`,
      `${pagePath}/management/faculty`,
    ],
    [`${pagePath}/labs`],
    [`${pagePath}/guest-lectures`],
    [`${pagePath}/workshops-and-bootcamps`],
    [`${pagePath}/library`],
    [`${pagePath}/academic-calendar`],
    [`${pagePath}/syllabus`],
    [`${pagePath}/e-resources`],
    [
      `${pagePath}/associations`,
      `${pagePath}/associations/uok`,
      `${pagePath}/associations/aicte`,
      `${pagePath}/associations/higher-education`,
    ],
  ]
);

exports.getAcademics = (req, res, next) => {
  res.render(
    `academics/academics`,
    Object.assign(
      params(`${pageTitle}`, `/`, "/data/imgs/academics-banner.jpg", ""),
      {
        isAuthenticated: req.session.isLoggedIn,
      }
    )
  );
};

// Routes to Computer applications
exports.getCS = (req, res, next) => {
  res.render(
    `academics/computer-applications`,
    Object.assign(
      params(
        `${pageTitle} - Computer Applications`,
        `/cs`,
        "/data/imgs/computer-science-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getBCA = (req, res, next) => {
  res.render(
    `academics/bca`,
    Object.assign(
      params(
        `Computer Applications - BCA`,
        `/cs/bca`,
        "/data/imgs/computer-science-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getMCA = (req, res, next) => {
  res.render(
    `academics/mca`,
    Object.assign(
      params(
        `Computer Applications - MCA`,
        `/cs/mca`,
        "/data/imgs/computer-science-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Route to management studies
exports.getManagement = (req, res, next) => {
  res.render(
    `academics/management-studies`,
    Object.assign(
      params(
        `${pageTitle} - Management Studies`,
        `/management`,
        "/data/imgs/management-studies-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getBBA = (req, res, next) => {
  res.render(
    `academics/bba`,
    Object.assign(
      params(
        `Management Studies - BBA`,
        `/management/bba`,
        "/data/imgs/management-studies-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getMBA = (req, res, next) => {
  res.render(
    `academics/mba`,
    Object.assign(
      params(
        `Management Studies - MBA`,
        `/management/mba`,
        "/data/imgs/management-studies-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Route to labs
exports.getLabs = (req, res, next) => {
  res.render(
    `academics/labs`,
    Object.assign(
      params(`${pageTitle} - Labs`, `/labs`, "/data/imgs/labs-banner.jpg", ""),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Route to faculty and related
exports.getFaculty = (req, res, next) => {
  res.render(
    `academics/faculty`,
    Object.assign(
      params(
        `${pageTitle} - Faculty`,
        `/faculty`,
        "/data/collegeImgs/faculty.JPG",
        ""
      ),
      {
        isAuthenticated: req.session.isLoggedIn,
      }
    )
  );
};
exports.getCSFaculty = (req, res, next) => {
  // Fetches details of computer science faculty from db
  query(
    "SELECT name, gender, photograph, qualification, experience, specialization, appointedAs, department, resume FROM ?? WHERE (department = 'cs') ORDER BY name",
    ["teachingFaculty"]
  )
    .then((result) => {
      // Renders the view
      res.render(
        `academics/cs-faculty`,
        Object.assign(
          params(
            `Faculty - Computer Science`,
            `/cs/faculty`,
            "/data/collegeImgs/faculty.JPG",
            ""
          ),
          { teachingFaculty: result, isAuthenticated: req.session.isLoggedIn }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
exports.getManagementFaculty = (req, res, next) => {
  // Fetches details of management faculty from db
  query(
    "SELECT name, gender, photograph, qualification, experience, specialization, appointedAs, department, resume FROM ?? WHERE (department = 'ms') ORDER BY name",
    ["teachingFaculty"]
  )
    .then((result) => {
      // Renders the view
      res.render(
        `academics/management-faculty`,
        Object.assign(
          params(
            `Faculty - Management Studies`,
            `/management/faculty`,
            "/data/collegeImgs/faculty.JPG",
            ""
          ),
          { teachingFaculty: result, isAuthenticated: req.session.isLoggedIn }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Route to guest lectures
exports.getGuestLectures = (req, res, next) => {
  query("SELECT * FROM guestLectures ORDER BY date DESC")
    .then((guestLectures) => {
      res.render(
        `academics/guest-lectures`,
        Object.assign(
          params(
            `${pageTitle} - Guest Lectures`,
            `/guest-lectures`,
            "/data/imgs/guest-lectures-banner.jpg",
            ""
          ),
          { guestLectures, isAuthenticated: req.session.isLoggedIn }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't fetch guest lectures. Try again later.");
    });
};

// Route to workshops
exports.getWorkshopsAndBootcamps = (req, res, next) => {
  query(
    "SELECT * FROM workshopsAndBootcamps WHERE YEAR(date) BETWEEN YEAR(CURDATE()) - 2 AND YEAR(CURDATE()) ORDER BY date DESC"
  )
    .then((workshopsAndBootcamps) => {
      res.render(
        `academics/workshops-and-bootcamps`,
        Object.assign(
          params(
            `${pageTitle} - Workshops And Bootcamps`,
            `/workshops-and-bootcamps`,
            "/data/imgs/workshops-banner.jpg",
            ""
          ),
          { workshopsAndBootcamps, isAuthenticated: req.session.isLoggedIn }
        )
      );
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send("Can't fetch workshops and bootcamps. Try again later.");
    });
};

// Route to library
exports.getLibrary = (req, res, next) => {
  res.render(
    `academics/library`,
    Object.assign(
      params(
        `${pageTitle} - Library`,
        `/library`,
        "/data/imgs/library-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Route to labs
exports.getAcademicCalendar = (req, res, next) => {
  res.render(
    `academics/academic-calendar`,
    Object.assign(
      params(
        `${pageTitle} - Academic Calendar`,
        `/academic-calendar`,
        "/data/imgs/academic-calendar-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Route to syllabus
exports.getSyllabus = (req, res, next) => {
  res.render(
    `academics/syllabus`,
    Object.assign(
      params(
        `${pageTitle} - Syllabus`,
        `/syllabus`,
        "/data/imgs/syllabus-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Route to E-Resources
exports.getEResources = (req, res, next) => {
  res.render(
    `academics/e-resources`,
    Object.assign(
      params(
        `${pageTitle} - E-Resouces`,
        `/e-resources`,
        "/data/imgs/e-resources-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

// Routes to Associations and related
exports.getAssociations = (req, res, next) => {
  res.render(
    `academics/associations`,
    Object.assign(
      params(
        `${pageTitle} - Associations`,
        `/associations`,
        "/data/imgs/associations-banner.png",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getUOK = (req, res, next) => {
  res.render(
    `academics/uok`,
    Object.assign(
      params(
        `Associations - UOK`,
        `/associations/uok`,
        "/data/imgs/uok-banner.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getAICTE = (req, res, next) => {
  res.render(
    `academics/aicte`,
    Object.assign(
      params(
        `Associations - AICTE`,
        `/associations/aicte`,
        "/data/imgs/aicte.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getHigherEducation = (req, res, next) => {
  res.render(
    `academics/higher-education`,
    Object.assign(
      params(
        `associations - Dept. of Higher Education`,
        `/associations/higher-education`,
        "/data/imgs/higher-education.jpg",
        ""
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
