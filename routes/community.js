const path = require("path");
const express = require("express");

const router = express.Router();

const communityController = require("../controllers/community");

// Route to / at community
router.get("/", communityController.getCommunity);

// Route to /alumni at communtiy
router.get("/alumni", communityController.getAlumni);

// Route to /videos at communtiy
router.get("/videos", communityController.getVideos);
router.get("/videos/campus", communityController.getCampusVideos);
router.get("/videos/events", communityController.getEventVideos);

// Asynchronous routes to fetch campus and event videos 
router.get("/fetch-campus-videos", communityController.fetchCampusVideos);
router.get("/fetch-event-videos", communityController.fetchEventVideos);

module.exports = router;
