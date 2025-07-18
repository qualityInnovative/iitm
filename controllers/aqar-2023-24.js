const mainParams = require("../utils/params");
const pageTitle = `AQAR 2023-24`;
const pagePath = `/aqar-2023-24`;

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
    ["Criteria 3", "3.2", "3.2.2" ,"3.4.1","3.5.1"],
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
    ["Minutes of Meetings"],
    ["Annual Gender Sensitization Plan"],
    ["Calendar of Activities"],
  ],
  [
    [
      `${pagePath}/attribute1`,
      `${pagePath}/attribute1/feedback-analysis-and-action-taken-report`,
      `${pagePath}/attribute1/stakeholders-feedback`,
    ],
    [`${pagePath}/attribute2`, `${pagePath}/attribute2/student-satisfaction-survey`],
    [
      `${pagePath}/attribute3`,
      `${pagePath}/attribute3/3_2`,
      `${pagePath}/attribute3/3_2_2`,
      `${pagePath}/attribute3/3_4_1`,
      `${pagePath}/attribute3/3_5_1`
    ],
    [
      `${pagePath}/attribute4`,
      `${pagePath}/attribute4/doc1`,
      `${pagePath}/attribute4/doc2`,
      `${pagePath}/attribute4/room3`,
      `${pagePath}/attribute4/room4`,
      `${pagePath}/attribute4/room5`,
      `${pagePath}/attribute4/room9`,
      `${pagePath}/attribute4/room10`,
      `${pagePath}/attribute4/room13`,
      `${pagePath}/attribute4/room14`,
      `${pagePath}/attribute4/room15`,
      `${pagePath}/attribute4/room35`,
      `${pagePath}/attribute4/room36`,
      `${pagePath}/attribute4/room37`,
      `${pagePath}/attribute4/room46`,
    ],
    [
      `${pagePath}/attribute5`,
      `${pagePath}/attribute5/5_1_1`,
      `${pagePath}/attribute5/5_1_2`,
      `${pagePath}/attribute5/5_1_3`,
      `${pagePath}/attribute5/5_1_5`,
      `${pagePath}/attribute5/5_2_1`,
      `${pagePath}/attribute5/5_2_2`,
      `${pagePath}/attribute5/5_3_1`,
      `${pagePath}/attribute5/5_3_2`,
      `${pagePath}/attribute5/5_3_3`,
      `${pagePath}/attribute5/5_4_1`,
    ],
    [`${pagePath}/attribute6`],
    [
      `${pagePath}/attribute7`,
      `${pagePath}/attribute7/7_1_1`,
      `${pagePath}/attribute7/7_1_2`,
      `${pagePath}/attribute7/7_1_3`,
      `${pagePath}/attribute7/7_1_4`,
      `${pagePath}/attribute7/7_1_5`,
      `${pagePath}/attribute7/7_1_6`,
      `${pagePath}/attribute7/7_1_7`,
      `${pagePath}/attribute7/7_1_8`,
      `${pagePath}/attribute7/7_1_9`,
      `${pagePath}/attribute7/7_1_10`,
      `${pagePath}/attribute7/7_1_11`,
      `${pagePath}/attribute7/institutional-distinctiveness`,
      `${pagePath}/attribute7/best-practices`,
    ],
    [`${pagePath}/minutes_of_meetings`],
    [`${pagePath}/annual_gender_sensitization_plan`],
    [`${pagePath}/calendar_of_activities`],
  ]
);
exports.getMinutesOfMeetings = (req, res, next) => {
  res.render(
    `aqar-2023-24/minutes_of_meetings`,
    Object.assign(
      params(
        `/minutes_of_meetings`,
        `${pagePath}/minutes_of_meetings`,
        "/data/imgs/aqar.jpeg",
        "Minutes of Meetings"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getAnnualGenderSensitizationPlan = (req, res, next) => {
  res.render(
    `aqar-2023-24/annual_gender_sensitization_plan`,
    Object.assign(
      params(
        `AQAR 2023-24 - Annual Gender Sensitization Plan`,
        `${pagePath}/annual_gender_sensitization_plan`,
        "/data/imgs/aqar.jpeg",
        "Annual Gender Sensitization Plan"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCalendarOfActivities = (req, res, next) => {
  res.render(
    `aqar-2023-24/calendar_of_activities`,
    Object.assign(
      params(
        `AQAR 2023-24 - Calendar of Activities`,
        `${pagePath}/calendar_of_activities`,
        "/data/imgs/aqar.jpeg",
        "Calendar of Activities"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

exports.getAQAR2223 = (req, res, next) => {
  res.render(
    `aqar-2023-24/aqar-2023-24`,
    Object.assign(
      params(
        `AQAR 2023-24`,
        `/aqar-2023-24`,
        "/data/imgs/aqar.jpeg",
        "AQAR 2023-24"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};

//? ///////////////////////////////////////////////////////
//? CRITERIA 1
exports.getCriteria1 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute1`,
    Object.assign(
      params(
        `AQAR 2023-24 - Criteria 1`,
        `/attribute1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getFAATR = (req, res, next) => {
  res.render(
    `aqar-2023-24/feedback-analysis-and-action-taken-report`,
    Object.assign(
      params(
        `Criteria 1 - Feedback Analysis and Action Taken Report`,
        `/attribute1/feedback-analysis-and-action-taken-report`,
        "/data/imgs/aqar.jpeg",
        "Criteria 1 - Feedback Analysis and Action Taken Report"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getStakeholdersFeedback = (req, res, next) => {
  res.render(
    `aqar-2023-24/stakeholders-feedback`,
    Object.assign(
      params(
        `Criteria 1 - Stakeholders Feedback`,
        `/attribute1/stakeholders-feedback`,
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
    `aqar-2023-24/attribute2`,
    Object.assign(
      params(
        `AQAR 2023-24 - Criteria 2`,
        `/attribute2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria2__student_satisfaction_survey = (req, res, next) => {
  res.render(
    `aqar-2023-24/student-satisfaction-survey`,
    Object.assign(
      params(
        `Criteria 2 - Student Satisfaction Survey`,
        `/attribute2/student-satisfaction-survey`,
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
    `aqar-2023-24/attribute3`,
    Object.assign(
      params(
        `AQAR 2023-24 - Criteria 3`,
        `/attribute3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria3__3_2 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute3_3_2`,
    Object.assign(
      params(
        `Criteria 3 - 3.2`,
        `/attribute3/3_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 3 - 3.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria3__3_2_2 = (req, res) => {
  res.render(
    `aqar-2023-24/attribute3_3_2_2`,
    Object.assign(
      params(
        `Criteria 3 - 3.2.2`,
        `/attribute3/3_2_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 3 - 3.2.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria3__3_4_1 = (req, res) => {
  res.render(
    `aqar-2023-24/attribute3_3_4_1`,
    Object.assign(
      params(
        `Criteria 3 - 3.4.1`,
        `/attribute3/3_4_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 3 - 3.4.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria3__3_5_1 = (req, res) => {
  res.render(
    `aqar-2023-24/attribute3_3_5_1`,
    Object.assign(
      params(
        `Criteria 3 - 3.5.1`,
        `/attribute3/3_5_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 3 - 3.5.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};


//? ///////////////////////////////////////////////////////
//? CRITERIA 4
exports.getCriteria4 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4`,
    Object.assign(
      params(
        `AQAR 2023-24 - Criteria 4`,
        `/attribute4`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_doc1 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_doc1`,
    Object.assign(
      params(
        `Criteria 4 - Document 1`,
        `/attribute4/doc1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Document 1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_doc2 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_doc2`,
    Object.assign(
      params(
        `Criteria 4 - Document 2`,
        `/attribute4/doc2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Document 2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room3 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room3`,
    Object.assign(
      params(
        `Criteria 4 - Room 3`,
        `/attribute4/room3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room4 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room4`,
    Object.assign(
      params(
        `Criteria 4 - Room 4`,
        `/attribute4/room4`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 4"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room5 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room5`,
    Object.assign(
      params(
        `Criteria 4 - Room 5`,
        `/attribute4/room5`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 5"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room9 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room9`,
    Object.assign(
      params(
        `Criteria 4 - Room 9`,
        `/attribute4/room9`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 9"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room10 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room10`,
    Object.assign(
      params(
        `Criteria 4 - Room 10`,
        `/attribute4/room10`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 10"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room13 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room13`,
    Object.assign(
      params(
        `Criteria 4 - Room 13`,
        `/attribute4/room13`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 13"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room14 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room14`,
    Object.assign(
      params(
        `Criteria 4 - Room 14`,
        `/attribute4/room14`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 14"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room15 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room15`,
    Object.assign(
      params(
        `Criteria 4 - Room 15`,
        `/attribute4/room15`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 15"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room35 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room35`,
    Object.assign(
      params(
        `Criteria 4 - Room 35`,
        `/attribute4/room35`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 35"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room36 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room36`,
    Object.assign(
      params(
        `Criteria 4 - Room 36`,
        `/attribute4/room36`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 36"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room37 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room37`,
    Object.assign(
      params(
        `Criteria 4 - Room 37`,
        `/attribute4/room37`,
        "/data/imgs/aqar.jpeg",
        "Criteria 4 - Room 37"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria4_room46 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute4_room46`,
    Object.assign(
      params(
        `Criteria 4 - Room 46`,
        `/attribute4/room46`,
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
    `aqar-2023-24/attribute5`,
    Object.assign(
      params(
        `AQAR 2023-24 - Criteria 5`,
        `/attribute5`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_1_1 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_1_1`,
    Object.assign(
      params(
        `Criteria 5 - 5.1.1`,
        `/attribute5/5_1_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.1.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_1_2 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_1_2`,
    Object.assign(
      params(
        `Criteria 5 - 5.1.2`,
        `/attribute5/5_1_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.1.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_1_3 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_1_3`,
    Object.assign(
      params(
        `Criteria 5 - 5.1.3`,
        `/attribute5/5_1_3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.1.3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_1_5 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_1_5`,
    Object.assign(
      params(
        `Criteria 5 - 5.1.5`,
        `/attribute5/5_1_5`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.1.5"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_2_1 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_2_1`,
    Object.assign(
      params(
        `Criteria 5 - 5.2.1`,
        `/attribute/5_2_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.2.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_2_2 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_2_2`,
    Object.assign(
      params(
        `Criteria 5 - 5.2.2`,
        `/attribute5/5_2_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.2.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_3_1 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_3_1`,
    Object.assign(
      params(
        `Criteria 5 - 5.3.1`,
        `/attribute5/5_3_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.3.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_3_2 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_3_2`,
    Object.assign(
      params(
        `Criteria 5 - 5.3.2`,
        `/attribute5/5_3_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.3.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_3_3 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_3_3`,
    Object.assign(
      params(
        `Criteria 5 - 5.3.3`,
        `/attribute5/5_3_3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 5 - 5.3.3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria5__5_4_1 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute5_5_4_1`,
    Object.assign(
      params(
        `Criteria 5 - 5.4.1`,
        `/attribute5/5_4_1`,
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
    `aqar-2023-24/attribute6`,
    Object.assign(
      params(
        `AQAR 2023-24 - Criteria 6`,
        `/attribute6`,
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
    `aqar-2023-24/attribute7`,
    Object.assign(
      params(
        `AQAR 2023-24 - Criteria 7`,
        `/attribute7`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_1 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_1`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.1`,
        `/attribute7/7_1_1`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.1"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_2 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_2`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.2`,
        `/attribute7/7_1_2`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.2"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_3 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_3`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.3`,
        `/attribute7/7_1_3`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.3"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_4 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_4`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.4`,
        `/attribute7/7_1_4`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.4"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_5 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_5`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.5`,
        `/attribute7/7_1_5`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.5"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_6 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_6`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.6`,
        `/attribute7/7_1_6`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.6"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_7 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_7`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.7`,
        `/attribute7/7_1_7`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.7"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_8 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_8`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.8`,
        `/attribute7/7_1_8`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.8"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_9 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_9`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.9`,
        `/attribute7/7_1_9`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.9"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_10 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_10`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.10`,
        `/attribute7/7_1_10`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.10"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__7_1_11 = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_7_1_11`,
    Object.assign(
      params(
        `Criteria 7 - 7.1.11`,
        `/attribute7/7_1_11`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - 7.1.11"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__institutional_distinctiveness = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_institutional_distinctiveness`,
    Object.assign(
      params(
        `Criteria 7 - Institutional Distinctiveness`,
        `/attribute7/institutional-distinctiveness`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - Institutional Distinctiveness"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
exports.getCriteria7__best_practices = (req, res, next) => {
  res.render(
    `aqar-2023-24/attribute7_best_practices`,
    Object.assign(
      params(
        `Criteria 7 - Best Practices`,
        `/attribute7/best-practices`,
        "/data/imgs/aqar.jpeg",
        "Criteria 7 - Best Practices"
      ),
      { isAuthenticated: req.session.isLoggedIn }
    )
  );
};
