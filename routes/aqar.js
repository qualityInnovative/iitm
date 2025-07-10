const express = require("express");
const router = express.Router();
const aqarController = require("../controllers/aqar");

router.get("/:id", aqarController.getAQARdetails);
router.get("/:yearId/criteria/:criteriaId", aqarController.getSingleCriteria);
router.get("/document/:documentId", aqarController.getSingleDocument);
module.exports = router;
