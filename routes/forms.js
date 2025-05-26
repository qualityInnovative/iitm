const express = require("express");

const router = express.Router();

const formsController = require("../controllers/forms");

router.post("/post-contact-us", formsController.postContactUs);
router.post("/post-feedback", formsController.postFeedback);
router.post("/post-grievance", formsController.postGrievance);
router.post("/post-new-admission", formsController.postNewAdmission);

module.exports = router;
