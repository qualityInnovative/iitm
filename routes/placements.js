const path = require("path");
const express = require("express");

const router = express.Router();

const placementsController = require("../controllers/placements");

// Route to / at /placements
router.get("/", placementsController.getPlacements);

// Route to /interships at /placements
router.get("/internships", placementsController.getInternships);

// Route to /industrial-visits at /placements
router.get("/industrial-visits", placementsController.getIndustrialVisists);
router.post("/industrial-visits/delete/:id", placementsController.deleteIndustrialVisit);


// Route to /mou at /placements
router.get("/mous", placementsController.getMOUS);
router.post(
    "/",
    placementsController.deletePlacementDriveHighlight
);

module.exports = router;
