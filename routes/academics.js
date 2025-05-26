const path = require("path");
const express = require("express");

const router = express.Router();

const academicsController = require("../controllers/academics");

// Route to / at /admissions
router.get("/", academicsController.getAcademics);

// Route to /cs at /academics
router.get("/cs", academicsController.getCS);
router.get("/cs/bca", academicsController.getBCA);
router.get("/cs/mca", academicsController.getMCA);
router.get("/cs/faculty", academicsController.getCSFaculty);

// Route to /management at /academics
router.get("/management", academicsController.getManagement);
router.get("/management/bba", academicsController.getBBA);
router.get("/management/mba", academicsController.getMBA);
router.get("/management/faculty", academicsController.getManagementFaculty);

// Route to /labs at /academics
router.get("/labs", academicsController.getLabs);

// Route to /faculty at /academics
router.get("/faculty", academicsController.getFaculty);
router.get("/faculty/cs", academicsController.getCSFaculty);
router.get("/faculty/management", academicsController.getManagementFaculty);

// Route to /guest-lectures at /academics
router.get("/guest-lectures", academicsController.getGuestLectures);

// Route to /workshops at /academics
router.get("/workshops-and-bootcamps", academicsController.getWorkshopsAndBootcamps);

// Route to /library at /academics
router.get("/library", academicsController.getLibrary);

// Route to /academic-calendar at /academics
router.get("/academic-calendar", academicsController.getAcademicCalendar);

// Route to /syllabus at /academics
router.get("/syllabus", academicsController.getSyllabus);

// Route to /E-Resources at /academics
router.get("/e-resources", academicsController.getEResources);

// Route to /associations at /academics and realted
router.get("/associations", academicsController.getAssociations);
router.get("/associations/uok", academicsController.getUOK);
router.get("/associations/aicte", academicsController.getAICTE);
router.get(
  "/associations/higher-education",
  academicsController.getHigherEducation
);

module.exports = router;
