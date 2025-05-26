const path = require("path");
const express = require("express");

const router = express.Router();

const admissionsController = require("../controllers/admissions");

// Route to /admissions at /admissions
router.get("/", admissionsController.getAdmissions);
router.get("/ug-admissions", admissionsController.getUGAdmissions);
router.get("/pg-admissions", admissionsController.getPGAdmissions);

// Route to /tution-and-fees at /admissions
router.get("/tution-and-fees", admissionsController.getTutionAndFees);

// Route to /rules-and-regulations at /admissions
router.get(
  "/rules-and-regulations",
  admissionsController.getRulesAndRegulations
);

// Route to /scholarships at /admissions
router.get("/scholarships", admissionsController.getScholarships);
router.get("/scholarships/stem", admissionsController.getStem);
router.get(
  "/scholarships/sakhawat-centre",
  admissionsController.getSakhawatCentre
);

// Route to /new-admission at /admissions
router.get("/new-admission", admissionsController.getNewAdmission);

module.exports = router;
