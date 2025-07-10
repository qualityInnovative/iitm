const mainParams = require("../utils/params");
const pageTitle = `AQAR 22-23`;
const pagePath = `/aqar-22-23`;

const params = mainParams(
  `${pageTitle}`,
  `${pagePath}`,
  [
    [
      "Criteria 1",
      "Feedback Analysis and Action Taken Report",
      "Stakeholders Feedback",
    ],
    ["Criteria 2", "Student Satisfaction Survey"],
    ["Criteria 3", "3.2", "3.2.2"],
    [
      "Criteria 4",
      "Document 1",
      "Document 2",
      "Room 3",
      "Room 4",
      "Room 5",
      "Room 9",
      "Room 10",
      "Room 13",
      "Room 14",
      "Room 15",
      "Room 35",
      "Room 36",
      "Room 37",
      "Room 46",
    ],
    [
      "Criteria 5",
      "5.1.1",
      "5.1.2",
      "5.1.3",
      "5.1.5",
      "5.2.1",
      "5.2.2",
      "5.3.1",
      "5.3.2",
      "5.3.3",
      "5.4.1",
    ],
    ["Criteria 6"],
    [
      "Criteria 7",
      "7.1.1",
      "7.1.2",
      "7.1.3",
      "7.1.4",
      "7.1.5",
      "7.1.6",
      "7.1.7",
      "7.1.8",
      "7.1.9",
      "7.1.10",
      "7.1.11",
      "Institutional Distinctiveness",
      "Best Practices",
    ],
  ],
  [
    [
      `${pagePath}/criteria1`,
      `${pagePath}/criteria1/feedback-analysis-and-action-taken-report`,
      `${pagePath}/criteria1/stakeholders-feedback`,
    ],
    [`${pagePath}/criteria2`, `${pagePath}/criteria2/student-satisfaction-survey`],
    [
      `${pagePath}/criteria3`,
      `${pagePath}/criteria3/3_2`,
      `${pagePath}/criteria3/3_2_2`,
    ],
    [
      `${pagePath}/criteria4`,
      `${pagePath}/criteria4/doc1`,
      `${pagePath}/criteria4/doc2`,
      `${pagePath}/criteria4/room3`,
      `${pagePath}/criteria4/room4`,
      `${pagePath}/criteria4/room5`,
      `${pagePath}/criteria4/room9`,
      `${pagePath}/criteria4/room10`,
      `${pagePath}/criteria4/room13`,
      `${pagePath}/criteria4/room14`,
      `${pagePath}/criteria4/room15`,
      `${pagePath}/criteria4/room35`,
      `${pagePath}/criteria4/room36`,
      `${pagePath}/criteria4/room37`,
      `${pagePath}/criteria4/room46`,
    ],
    [
      `${pagePath}/criteria5`,
      `${pagePath}/criteria5/5_1_1`,
      `${pagePath}/criteria5/5_1_2`,
      `${pagePath}/criteria5/5_1_3`,
      `${pagePath}/criteria5/5_1_5`,
      `${pagePath}/criteria5/5_2_1`,
      `${pagePath}/criteria5/5_2_2`,
      `${pagePath}/criteria5/5_3_1`,
      `${pagePath}/criteria5/5_3_2`,
      `${pagePath}/criteria5/5_3_3`,
      `${pagePath}/criteria5/5_4_1`,
    ],
    [`${pagePath}/criteria6`],
    [
      `${pagePath}/criteria7`,
      `${pagePath}/criteria7/7_1_1`,
      `${pagePath}/criteria7/7_1_2`,
      `${pagePath}/criteria7/7_1_3`,
      `${pagePath}/criteria7/7_1_4`,
      `${pagePath}/criteria7/7_1_5`,
      `${pagePath}/criteria7/7_1_6`,
      `${pagePath}/criteria7/7_1_7`,
      `${pagePath}/criteria7/7_1_8`,
      `${pagePath}/criteria7/7_1_9`,
      `${pagePath}/criteria7/7_1_10`,
      `${pagePath}/criteria7/7_1_11`,
      `${pagePath}/criteria7/institutional-distinctiveness`,
      `${pagePath}/criteria7/best-practices`,
    ],
  ]
);

exports.getAQAR2223 = (req, res, next) => {
  res.render(
    `aqar-22-23/aqar-22-23`,
    Object.assign(
      params(
        `AQAR 22-23`,
        `/aqar-22-23`,
        "/data/imgs/aqar.jpeg",
        "AQAR 2022-2023"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? ///////////////////////////////////////////////////////
//? CRITERIA 1
exports.getCriteria1 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria1`,
    Object.assign(
      params(
        `AQAR 22-23 - Criteria 1`,
        `/criteria1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getFAATR = (req, res, next) => {
  res.render(
    `aqar-22-23/feedback-analysis-and-action-taken-report`,
    Object.assign(
      params(
        `Criteria 1 - Feedback Analysis and Action Taken Report`,
        `/criteria1/feedback-analysis-and-action-taken-report`,
        "/data/imgs/aqar.jpeg",
        "Criteria 1 - Feedback Analysis and Action Taken Report"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getStakeholdersFeedback = (req, res, next) => {
  res.render(
    `aqar-22-23/stakeholders-feedback`,
    Object.assign(
      params(
        `Criteria 1 - Stakeholders Feedback`,
        `/criteria1/stakeholders-feedback`,
        "/data/imgs/aqar.jpeg",
        "Criteria 1 - Stakeholders Feedback"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? ///////////////////////////////////////////////////////
//? CRITERIA 2
exports.getCriteria2 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria2`,
    Object.assign(
      params(
        `AQAR 22-23 - Criteria 2`,
        `/criteria2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria2__student_satisfaction_survey = (req, res, next) => {
  res.render(
    `aqar-22-23/student-satisfaction-survey`,
    Object.assign(
      params(
        `Criteria 2 - Student Satisfaction Survey`,
        `/criteria2/student-satisfaction-survey`,
        "/data/imgs/aqar.jpeg",
        "Criteria 2 - Student Satisfaction Survey"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? ///////////////////////////////////////////////////////
//? CRITERIA 3
exports.getCriteria3 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria3`,
    Object.assign(
      params(
        `AQAR 22-23 - Criteria 3`,
        `/criteria3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria3__3_2 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria3_3_2`,
    Object.assign(
      params(
        `Criteria 3 - 3.2`,
        `/criteria3/3_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 3 - 3.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria3__3_2_2 = (req, res) => {
  res.render(
    `aqar-22-23/criteria3_3_2_2`,
    Object.assign(
      params(
        `Criteria 3 - 3.2.2`,
        `/criteria3/3_2_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 3 - 3.2.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? ///////////////////////////////////////////////////////
//? CRITERIA 4
exports.getCriteria4 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4`,
    Object.assign(
      params(
        `AQAR 22-23 - Criteria 4`,
        `/criteria4`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_doc1 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_doc1`,
    Object.assign(
      params(
        `Criteria 4 - Document 1`,
        `/criteria4/doc1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Document 1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_doc2 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_doc2`,
    Object.assign(
      params(
        `Criteria 4 - Document 2`,
        `/criteria4/doc2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Document 2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room3 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room3`,
    Object.assign(
      params(
        `Criteria 4 - Room 3`,
        `/criteria4/room3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room4 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room4`,
    Object.assign(
      params(
        `Criteria 4 - Room 4`,
        `/criteria4/room4`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 4"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room5 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room5`,
    Object.assign(
      params(
        `Criteria 4 - Room 5`,
        `/criteria4/room5`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 5"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room9 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room9`,
    Object.assign(
      params(
        `Criteria 4 - Room 9`,
        `/criteria4/room9`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 9"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room10 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room10`,
    Object.assign(
      params(
        `Criteria 4 - Room 10`,
        `/criteria4/room10`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 10"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room13 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room13`,
    Object.assign(
      params(
        `Criteria 4 - Room 13`,
        `/criteria4/room13`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 13"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room14 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room14`,
    Object.assign(
      params(
        `Criteria 4 - Room 14`,
        `/criteria4/room14`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 14"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room15 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room15`,
    Object.assign(
      params(
        `Criteria 4 - Room 15`,
        `/criteria4/room15`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 15"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room35 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room35`,
    Object.assign(
      params(
        `Criteria 4 - Room 35`,
        `/criteria4/room35`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 35"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room36 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room36`,
    Object.assign(
      params(
        `Criteria 4 - Room 36`,
        `/criteria4/room36`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 36"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room37 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room37`,
    Object.assign(
      params(
        `Criteria 4 - Room 37`,
        `/criteria4/room37`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 37"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getCriteria4_room46 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria4_room46`,
    Object.assign(
      params(
        `Criteria 4 - Room 46`,
        `/criteria4/room46`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 46"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? ///////////////////////////////////////////////////////
//? CRITERIA 5
exports.getCriteria5 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5`,
    Object.assign(
      params(
        `AQAR 22-23 - Criteria 5`,
        `/criteria5`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_1_1 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_1_1`,
    Object.assign(
      params(
        `Criteria 5 - 5.1.1`,
        `/criteria5/5_1_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.1.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_1_2 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_1_2`,
    Object.assign(
      params(
        `Criteria 5 - 5.1.2`,
        `/criteria5/5_1_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.1.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_1_3 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_1_3`,
    Object.assign(
      params(
        `Criteria 5 - 5.1.3`,
        `/criteria5/5_1_3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.1.3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_1_5 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_1_5`,
    Object.assign(
      params(
        `Criteria 5 - 5.1.5`,
        `/criteria5/5_1_5`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.1.5"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_2_1 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_2_1`,
    Object.assign(
      params(
        `Criteria 5 - 5.2.1`,
        `/criteria5/5_2_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.2.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_2_2 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_2_2`,
    Object.assign(
      params(
        `Criteria 5 - 5.2.2`,
        `/criteria5/5_2_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.2.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_3_1 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_3_1`,
    Object.assign(
      params(
        `Criteria 5 - 5.3.1`,
        `/criteria5/5_3_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.3.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_3_2 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_3_2`,
    Object.assign(
      params(
        `Criteria 5 - 5.3.2`,
        `/criteria5/5_3_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.3.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_3_3 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_3_3`,
    Object.assign(
      params(
        `Criteria 5 - 5.3.3`,
        `/criteria5/5_3_3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.3.3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_4_1 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria5_5_4_1`,
    Object.assign(
      params(
        `Criteria 5 - 5.4.1`,
        `/criteria5/5_4_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.4.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? ///////////////////////////////////////////////////////
//? CRITERIA 6
exports.getCriteria6 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria6`,
    Object.assign(
      params(
        `AQAR 22-23 - Criteria 6`,
        `/criteria6`,
        "/data/imgs/aqar.jpeg",
        "Criteria 6"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? ///////////////////////////////////////////////////////
//? CRITERIA 7
exports.getCriteria7 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7`,
    Object.assign(
      params(
        `AQAR 22-23 - Criteria 7`,
        `/criteria7`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_1 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_1`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.1`,
        `/criteria7/7_1_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_2 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_2`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.2`,
        `/criteria7/7_1_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_3 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_3`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.3`,
        `/criteria7/7_1_3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_4 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_4`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.4`,
        `/criteria7/7_1_4`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.4"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_5 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_5`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.5`,
        `/criteria7/7_1_5`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.5"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_6 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_6`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.6`,
        `/criteria7/7_1_6`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.6"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_7 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_7`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.7`,
        `/criteria7/7_1_7`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.7"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_8 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_8`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.8`,
        `/criteria7/7_1_8`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.8"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_9 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_9`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.9`,
        `/criteria7/7_1_9`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.9"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_10 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_10`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.10`,
        `/criteria7/7_1_10`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.10"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_11 = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_7_1_11`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.11`,
        `/criteria7/7_1_11`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.11"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__institutional_distinctiveness = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_institutional_distinctiveness`,
    Object.assign(
      params(
        `Criteria 7 - Institutional Distinctiveness`,
        `/criteria7/institutional-distinctiveness`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - Institutional Distinctiveness"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__best_practices = (req, res, next) => {
  res.render(
    `aqar-22-23/criteria7_best_practices`,
    Object.assign(
      params(
        `Criteria 7 - Best Practices`,
        `/criteria7/best-practices`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - Best Practices"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
