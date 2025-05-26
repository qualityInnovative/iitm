const express = require("express");

const router = express.Router();

const notificationsController = require("../controllers/notifications");

// NOTIFICATIONS ROUTES
router.get("/notifications", notificationsController.getNotifications);
router.get("/notifications/:id", notificationsController.getNotificationById);
router.get("/fetch-notifications", notificationsController.fetchNotifications);

module.exports = router;
