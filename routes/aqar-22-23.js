const express = require("express");

const router = express.Router();

const aqar2223Controller = require("../controllers/aqar-22-23");

router.get("/", aqar2223Controller.getAQAR2223);

router.get("/criteria1", aqar2223Controller.getCriteria1);
router.get(
  "/criteria1/feedback-analysis-and-action-taken-report",
  aqar2223Controller.getFAATR
);
router.get(
  "/criteria1/stakeholders-feedback",
  aqar2223Controller.getStakeholdersFeedback
);

router.get("/criteria2", aqar2223Controller.getCriteria2);
router.get(
  "/criteria2/student-satisfaction-survey",
  aqar2223Controller.getCriteria2__student_satisfaction_survey
);

router.get("/criteria3", aqar2223Controller.getCriteria3);
router.get("/criteria3/3_2", aqar2223Controller.getCriteria3__3_2);
router.get("/criteria3/3_2_2", aqar2223Controller.getCriteria3__3_2_2);

router.get("/criteria4", aqar2223Controller.getCriteria4);
router.get("/criteria4/doc1", aqar2223Controller.getCriteria4_doc1);
router.get("/criteria4/doc2", aqar2223Controller.getCriteria4_doc2);
router.get("/criteria4/room3", aqar2223Controller.getCriteria4_room3);
router.get("/criteria4/room4", aqar2223Controller.getCriteria4_room4);
router.get("/criteria4/room5", aqar2223Controller.getCriteria4_room5);
router.get("/criteria4/room9", aqar2223Controller.getCriteria4_room9);
router.get("/criteria4/room10", aqar2223Controller.getCriteria4_room10);
router.get("/criteria4/room13", aqar2223Controller.getCriteria4_room13);
router.get("/criteria4/room14", aqar2223Controller.getCriteria4_room14);
router.get("/criteria4/room15", aqar2223Controller.getCriteria4_room15);
router.get("/criteria4/room35", aqar2223Controller.getCriteria4_room35);
router.get("/criteria4/room36", aqar2223Controller.getCriteria4_room36);
router.get("/criteria4/room37", aqar2223Controller.getCriteria4_room37);
router.get("/criteria4/room46", aqar2223Controller.getCriteria4_room46);

router.get("/criteria5", aqar2223Controller.getCriteria5);
router.get("/criteria5/5_1_1", aqar2223Controller.getCriteria5__5_1_1);
router.get("/criteria5/5_1_2", aqar2223Controller.getCriteria5__5_1_2);
router.get("/criteria5/5_1_3", aqar2223Controller.getCriteria5__5_1_3);
router.get("/criteria5/5_1_5", aqar2223Controller.getCriteria5__5_1_5);
router.get("/criteria5/5_2_1", aqar2223Controller.getCriteria5__5_2_1);
router.get("/criteria5/5_2_2", aqar2223Controller.getCriteria5__5_2_2);
router.get("/criteria5/5_3_1", aqar2223Controller.getCriteria5__5_3_1);
router.get("/criteria5/5_3_2", aqar2223Controller.getCriteria5__5_3_2);
router.get("/criteria5/5_3_3", aqar2223Controller.getCriteria5__5_3_3);
router.get("/criteria5/5_4_1", aqar2223Controller.getCriteria5__5_4_1);

router.get("/criteria6", aqar2223Controller.getCriteria6);

router.get("/criteria7", aqar2223Controller.getCriteria7);
router.get("/criteria7/7_1_1", aqar2223Controller.getCriteria7__7_1_1);
router.get("/criteria7/7_1_2", aqar2223Controller.getCriteria7__7_1_2);
router.get("/criteria7/7_1_3", aqar2223Controller.getCriteria7__7_1_3);
router.get("/criteria7/7_1_4", aqar2223Controller.getCriteria7__7_1_4);
router.get("/criteria7/7_1_5", aqar2223Controller.getCriteria7__7_1_5);
router.get("/criteria7/7_1_6", aqar2223Controller.getCriteria7__7_1_6);
router.get("/criteria7/7_1_7", aqar2223Controller.getCriteria7__7_1_7);
router.get("/criteria7/7_1_8", aqar2223Controller.getCriteria7__7_1_8);
router.get("/criteria7/7_1_9", aqar2223Controller.getCriteria7__7_1_9);
router.get("/criteria7/7_1_10", aqar2223Controller.getCriteria7__7_1_10);
router.get("/criteria7/7_1_11", aqar2223Controller.getCriteria7__7_1_11);

router.get(
  "/criteria7/institutional-distinctiveness",
  aqar2223Controller.getCriteria7__institutional_distinctiveness
);
router.get(
  "/criteria7/best-practices",
  aqar2223Controller.getCriteria7__best_practices
);

module.exports = router;
