const path = require("path");
const express = require("express");

const router = express.Router();

const aboutController = require("../controllers/about");

// Route to / at /about
router.get("/", aboutController.getAbout);



// Route to /founder at /about
router.get("/founder", aboutController.getFounder);

// Route to /vision-mission-and-values at /about
router.get("/vision-mission-and-values", aboutController.getVMV);

// Route to /leadership at /about
router.get("/leadership", aboutController.getLeadership);

// Route to /organisational-chart at /about
router.get("/organisational-chart", aboutController.getOrganisationalChart);

// Route to /institutional-committees at /about
router.get(
  "/institutional-committees",
  aboutController.getInstitutionalCommittees
);

//? Institutional Clubs Routes
// Route to /institutional-clubs at /about
router.get("/institutional-clubs", aboutController.getInstitutionalClubs);

//? Accreditations Routes
// Route to /accreditations at /about
router.get("/accreditations", aboutController.getAccreditations);
router.get('/newaccreditations/:id', aboutController.getAccreditationSubsection);
// Route to /accreditations/naac at /about
router.get("/accreditations/naac", aboutController.getNAACAccreditation);
router.get("/accreditations/ssr", aboutController.getSSR);
router.get(
  "/accreditations/quality-profile",
  aboutController.getQualityProfile
);

//? Quality Assurance Routes
// router.get("/quality-assurance", aboutController.getQualityAssurance);
router.get("/quality-assurance/", aboutController.getQualityAssurance);
router.get("/quality-assurance/about", aboutController.getAboutIQAC);
router.get("/quality-assurance/composition", aboutController.getComposition);
router.get("/quality-assurance/mom-22-23", aboutController.getMOM2223);

router.get("/quality-assurance/mom", aboutController.getMOM);

router.get('/quality-assurance/mom/:id', aboutController.getMoMDetail); 

router.get("/quality-assurance/code-of-conduct", aboutController.getCodeOfConduct);
router.get("/quality-assurance/divyangjan", aboutController.getDivyangjan);
router.get("/quality-assurance/green-campus-policy", aboutController.getGreenCampusPolicy);
router.get("/quality-assurance/gender-sensitization-plan", aboutController.getGenderSensitizationPlan);
router.get("/quality-assurance/aqar",aboutController.getAQAR);

// Route to /contact at /about
router.get("/contact", aboutController.getContact);

// Route to /imi at /about
router.get("/imt", aboutController.getIMT);

// Route to /directory at /about
router.get("/directory", aboutController.getDirectory);

// Route to /contact-us at /about
router.get("/contact-us", aboutController.getContactUs);

// Route to /feedback at /about
router.get("/feedback", aboutController.getFeedback);

// Route to /grievance at /about
router.get("/grievance", aboutController.getGrievance);

module.exports = router;
