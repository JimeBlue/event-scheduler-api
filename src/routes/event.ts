// Bring in Express so I can use its routing tools
import express from "express";
// Bring in the controller functions 
import { getAllEvents, getOneEvent, createEvent, updateEvent, deleteEvent,  getUpcomingEvents} from "#controllers/event";

// Create a mini Express app (a "router") that just handles routes
const api = express.Router();


// For the "/"  (base) path:
//   GET  → run getAllEvents (list every event)
//   POST → run createEvent  (add a new event)
api.route("/").get(getAllEvents).post(createEvent);

// For the "/upcoming" path:
//   GET  → run getUpcomingEvents (list every upcoming event)
api.route("/upcoming").get(getUpcomingEvents);

// For the "/:id" path (":id" is a placeholder for a specific event's id):
//   GET    → run getOneEvent  (fetch that one event)
//   PUT    → run updateEvent  (change that event's details)
//   DELETE → run deleteEvent  (remove that event)
api.route("/:id").get(getOneEvent).put(updateEvent).delete(deleteEvent);

// Export this router so the main app file can plug these routes in
export default api;