const express = require("express");
const rateLimit = require("express-rate-limit");
const formsController = require("../controllers/forms");

const router = express.Router();

const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      // For each route, redirect back to the appropriate form page with an error query param
      if (req.originalUrl === '/post-new-admission') {
        return res.redirect('/admissions/new-admission?error=rate_limit');
      } else if (req.originalUrl === '/post-contact-us') {
        return res.redirect('/contact-us?error=rate_limit');
      } else if (req.originalUrl === '/post-feedback') {
        return res.redirect('/feedback?error=rate_limit');
      } else if (req.originalUrl === '/post-grievance') {
        return res.redirect('/grievance?error=rate_limit');
      } else {
        // fallback - send 429 plain text
        return res.status(429).send("Too many form submissions from this IP, please try again later.");
      }
    },
  });
// Apply the rate limiter to all POST form routes
router.post("/post-contact-us", formLimiter, formsController.postContactUs);
router.post("/post-feedback", formLimiter, formsController.postFeedback);
router.post("/post-grievance", formLimiter, formsController.postGrievance);
router.post("/post-new-admission", formLimiter, formsController.postNewAdmission);

module.exports = router;
