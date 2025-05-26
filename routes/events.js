const express = require("express");
const router = express.Router();

const eventsController = require("../controllers/events");

// Main route
router.get("/events", eventsController.getEvents);
// Asynchronous route to fetch more and more events on load more click
router.get("/fetch-events", eventsController.fetchEvents);
// Route to get events by id
router.get("/events/id/:id", eventsController.getEventById);
// Route to get events by data
router.get("/events/date/:date", eventsController.getEventsByDate);
// Route to get events by month
router.get("/events/month/:mmyyyy", eventsController.getEventsByMonth);
// Route to get events of current month
router.get("/events/current-month", eventsController.getEventsOfCurrentMonth);
// Route to get events of next
router.get("/events/next-month", eventsController.getEventsOfNextMonth);

module.exports = router;
