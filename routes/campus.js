const path = require("path");
const express = require("express");

const router = express.Router();

const campusController = require("../controllers/campus");

// Route to / at /campus
router.get("/", campusController.getCampus);

// Route to /canteen at /campus
router.get("/canteen", campusController.getCanteen);

// Route to /sports at /campus
router.get("/sports", campusController.getSports);

// Route to /transportation at /campus
router.get("/transportation", campusController.getTransportation);

// Virtual Campus Tour
router.get("/virtual-tour", campusController.getVirtualTour);

// Route to /hostel at /campus
router.get("/hostel", campusController.getHostel);

module.exports = router;
