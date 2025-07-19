const pageTitle = "About";
const pagePath = "/about";
const bannerPath = "/data/imgs/";

const query = require("../utils/db");
const mainParams = require("../utils/params");

let Accreditationsubmenu = ["1", "2", "3"];
let Accreditationsubtitle = ["NAAC", "SSR", "Quality Profile"];


async function refreshAccreditationMenu() {
  try {
    const subsections = await query(
      "SELECT * FROM accreditation_subsections WHERE section_id = 2 ORDER BY subsection_order ASC"
    );

    if (subsections.length > 0) {
      Accreditationsubmenu = subsections.map(sub => sub.id);
      Accreditationsubtitle = subsections.map(sub => sub.subsection_title);
      console.log(Accreditationsubtitle)
    }
  } catch (error) {
    console.error('Error refreshing accreditation menu:', error);
    
  }
}
refreshAccreditationMenu();

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
    ["Accreditation", ...Accreditationsubtitle.map(sub=>sub)],
    [
      "Quality Assurance",
      "About IQAC",
      "IQAC Composition",
      "AQAR",
      "IQAC Minutes of Meeting",
      "Code of Conduct",
      "Divyangjan",
      "Green Campus Policy",
      "Gender Sensitization Plan",
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
      ...Accreditationsubmenu.map(sub => `${pagePath}/newaccreditations/${sub}`)
    ],
    [
      `${pagePath}/quality-assurance/`,
      `${pagePath}/quality-assurance/about`,
      `${pagePath}/quality-assurance/composition`,
      `${pagePath}/quality-assurance/aqar`,
      `${pagePath}/quality-assurance/mom`,
      `${pagePath}/quality-assurance/code-of-conduct`,
      `${pagePath}/quality-assurance/divyangjan`,
      `${pagePath}/quality-assurance/green-campus-policy`,
      `${pagePath}/quality-assurance/gender-sensitization-plan`,
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

exports.getAQAR = async (req, res, next) => {
  try {
    const aqarYears = await query('SELECT * FROM aqar_years ORDER BY year_label DESC');
    res.render(
      "about/aqar",
      Object.assign(
        params(
          "AQAR",
          "/quality-assurance/aqar",
          "/data/imgs/about-iqac.jpg",
          ""
        ),
        {
          isAuthenticated: req.session.isLoggedIn,
          aqarYears, // ← pass data to pug view
        }
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
exports.getAbout = (req, res, next) => {
  res.render(
    "about/about",
    Object.assign(
      params(
        `IITM - ${pageTitle}`,
        "/",
        "/data/collegeImgs/college-1.png",
        '"Empowering students to thrive in their careers through transformative education at IITM"'
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

exports.getOrganisationalChart = async (req, res, next) => {
  try {
    // Get the organizational chart data from database
    const [orgChart] = await query(
      "SELECT id, title, description, image_path, updated_at FROM organizational_charts ORDER BY id DESC LIMIT 1"
    );

    // Render the view with all necessary parameters
    res.render(
      "about/organisational-chart",
      Object.assign(
        params(
          `${pageTitle} - Organisational Chart`,
          "/organisational-chart",
          `${bannerPath}org-chart-banner.jpg`,
          ""
        ),
        { 
          isAuthenticated: req.session.isLoggedIn,
          orgChart // Pass the organizational chart data to the view
        }
      )
    );
  } catch (err) {
    console.error("Error loading organizational chart:", err);
    next(err); // Pass to error handling middleware
  }
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

exports.getAccreditations = async (req, res, next) => {
  try {
    // Get the main accreditation section
    const [accreditation] = await query(
      "SELECT * FROM accreditation_sections WHERE section_name = 'accreditation'"
    );

    // Get all subsections for this accreditation
    const subsections = await query(
      "SELECT * FROM accreditation_subsections WHERE section_id = ? ORDER BY subsection_order ASC",
      [accreditation.id]
    );

    res.render(
      "about/accreditations",
      Object.assign(
        params(
          `${pageTitle} - Accreditations`,
          "/newaccreditations",
          `${bannerPath}accreditations-banner.jpg`,
          ""
        ),
        {
          isAuthenticated: req.session.isLoggedIn,
          accreditation: accreditation,
          subsections: subsections
        }
      )
    );
  } catch (error) {
    console.error('Error fetching accreditations:', error);
    next(error);
  }
};
// Get single accreditation subsection
exports.getAccreditationSubsection = async (req, res, next) => {
  try {
    const [subsection] = await query(
      "SELECT * FROM accreditation_subsections WHERE id = ?",
      [req.params.id]
    );

    if (!subsection) {
      return res.status(404).render('error/404');
    }

    res.render(
      "about/accreditation-subsection",
      Object.assign(
        params(
          `${pageTitle} - ${subsection.subsection_title}`,
          `/accreditations/${subsection.id}`,
          `${bannerPath}accreditations-banner.jpg`,
          ""
        ),
        {
          isAuthenticated: req.session.isLoggedIn,
          subsection: subsection
        }
      )
    );
  } catch (error) {
    console.error('Error fetching accreditation subsection:', error);
    next(error);
  }
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
  // First get the IQAC members data
  query(`
    SELECT * FROM iqac_composition 
    WHERE is_active = 1
    ORDER BY display_order ASC, serial_no ASC, member_name ASC
  `)
    .then((iqacMembers) => {
      // Group members by category for the table
      const categories = {};
      iqacMembers.forEach(member => {
        if (!categories[member.category_description]) {
          categories[member.category_description] = [];
        }
        categories[member.category_description].push(member);
      });

      // Render the template with both your params and the members data
      res.render(
        "about/iqac-composition",
        Object.assign(
          params(
            `IQAC Composition`,
            "/quality-assurance/composition",
            "/data/imgs/iqac-composition.jpg",
            ""
          ),
          {
            isAuthenticated: req.session.isLoggedIn,
            iqacMembers: iqacMembers || [],
            categories: categories
          }
        )
      );
    })
    .catch(err => {
      console.error("Error fetching IQAC composition:", err);
      // Render the page even if there's an error (with empty data)
      res.render(
        "about/iqac-composition",
        Object.assign(
          params(
            `IQAC Composition`,
            "/quality-assurance/composition",
            "/data/imgs/iqac-composition.jpg",
            ""
          ),
          {
            isAuthenticated: req.session.isLoggedIn,
            iqacMembers: [],
            categories: {},
            errorMessage: "Failed to load IQAC composition data"
          }
        )
      );
    });
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
// getMOM
exports.getMOM = async (req, res, next) => {
  try {
    // Fetch meeting minutes with custom ordering
    const minutes = await query(`
      SELECT id, title, file_path, original_filename, 
             created_at, display_order
      FROM meeting_minutes
      ORDER BY 
        display_order IS NULL,  -- Push NULLs to the end
        display_order,          -- Ordered numbers (ascending)
        created_at DESC         -- Newest first for same order
    `);

    res.render(
      "about/mom",
      Object.assign(
        params(
          `Minutes of Meeting`,
          "/quality-assurance/mom",
          "/data/imgs/iqac-composition.jpg",
          ""
        ),
        {
          isAuthenticated: req.session.isLoggedIn,
          minutes  // Pass the ordered minutes to the view
        }
      )
    );
  } catch (err) {
    console.error("Error fetching meeting minutes:", err);
    // Pass empty array on error to prevent template crash
    res.render(
      "about/mom",
      Object.assign(
        params(
          `Minutes of Meeting`,
          "/quality-assurance/mom",
          "/data/imgs/iqac-composition.jpg",
          ""
        ),
        {
          isAuthenticated: req.session.isLoggedIn,
          minutes: []
        }
      )
    );
  }
};;
exports.getMoMDetail = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Fetch specific meeting minute by ID
    const [minute] = await query(`
      SELECT id, title, file_path, original_filename, created_at
      FROM meeting_minutes
      WHERE id = ?
    `, [id]);

    if (!minute) {
      // Handle not found
      return res.redirect('/quality-assurance/mom');
    }

    res.render(
      "about/mom-detail",
      Object.assign(
        params(
          `${minute.title} | Minutes of Meeting`,
          `/quality-assurance/mom/${id}`,
          "/data/imgs/iqac-composition.jpg",
          ""
        ),
        {
          isAuthenticated: req.session.isLoggedIn,
          minute
        }
      )
    );
  } catch (err) {
    console.error("Error fetching meeting minute:", err);
    return res.redirect('/quality-assurance/mom');
  }
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
