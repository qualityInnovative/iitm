const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// CMS ADMIN ROUTE
router.get("/cms/admin-cms", adminController.getAdminDash);

// CMS ADMIN ROUTE TO MANAGE HOME PAGE
router.get("/cms/admin-home", adminController.getHomeDash);
router.post("/cms/upload-homeButton", adminController.postHomeButton);
router.post("/cms/upload-homeHeading", adminController.postHomeHeading);
router.post("/cms/upload-gallery", adminController.postGallery);
router.post("/cms/upload-homeCarousel", adminController.postHomeCarousel);

// NOTIFICATION ADMIN RELATED ROUTES
router.get("/cms/admin-notifications", adminController.getNotificationDash);
router.post("/cms/upload-notification", adminController.postNotification);
router.post(
  "/cms/delete-notification/:nid",
  adminController.deleteNotification
);

// NEWS ADMIN RELATED ROUTES
router.get("/cms/admin-news", adminController.getNewsDash);
router.post("/cms/upload-news", adminController.postNews);
router.post("/cms/delete-news/:nid", adminController.deleteNews);

// EVENTS ADMIN RELATED ROUTES
router.get("/cms/admin-events", adminController.getEventsDash);
router.post("/cms/upload-event", adminController.postEvent);
router.post("/cms/delete-event/:eid", adminController.deleteEvent);
// Routes to upload and delete video
router.post("/cms/upload-video", adminController.postVideo);
router.post("/cms/delete-video/:vid", adminController.deleteVideo);

// SO, PRO and GR Router
router.get("/cms/so-iitm", adminController.getSODash);
router.get(
  "/cms/contact-form-submissions",
  adminController.getContactFormSubmissions
);
router.get("/cms/fetch-contacts", adminController.fetchContacts);
router.post("/cms/delete-contact-us/:cid", adminController.postDeleteContact);

router.get("/cms/pro-iitm", adminController.getPRODash);
router.get("/cms/feedbacks", adminController.getFeedbacks);
router.get("/cms/fetch-feedbacks", adminController.fetchFeedbacks);

router.get("/cms/gr-iitm", adminController.getGRDash);
router.get("/cms/fetch-grievances", adminController.fetchGrievances);
router.post("/cms/upload-redressal/:gid", adminController.redressGrievance);
router.get(
  "/cms/gr-iitm/redressed-grievances",
  adminController.getRedressedGRDash
);
router.get(
  "/cms/fetch-redressed-grievances",
  adminController.fetchRedressedGrievances
);

// Placement Officer Related Router
router.get("/cms/po-iitm", adminController.getPODash);
router.get("/cms/admin-placements", adminController.getPlacementsDash);
router.post("/cms/upload-testimonial", adminController.postTestimonial);
router.post("/cms/upload-highlight", adminController.postHighlight);
router.post(
  "/cms/upload-workshop-bootcamp",
  adminController.postWorkshopBootcamp
);
router.post("/cms/upload-guest-lecture", adminController.postGuestLecture);
router.post(
  "/cms/upload-industrial-visit",
  adminController.postIndustrialVisit
);

// ADMISSIONS ADMIN RELATED ROUTES
router.get("/cms/admissions-iitm", adminController.getAdmissionsDash);
router.post(
  "/cms/admissions-iitm/admit-student/:aid",
  adminController.admitStudent
);

// HODs
router.get("/cms/cs-hod", adminController.getHODCS);
router.get("/cms/ms-hod", adminController.getHODMS);

// Coordinators
router.get("/cms/cs-coordinator", adminController.getCoordinatorCS);
router.get("/cms/ms-coordinator", adminController.getCoordinatorMS);

router.get("/cms/director-iitm", adminController.getDirectorDash);
router.get("/cms/admin-logs", adminController.getLogsDash);

// Change password Routes
router.get("/cms/change-password", adminController.getChangePassword);
router.get("/cms/change-password/:error", adminController.getChangePassword);
router.post("/cms/change-password", adminController.postChangePassword);

// API Route
router.get("/cms/api", adminController.getAPI);

module.exports = router;
