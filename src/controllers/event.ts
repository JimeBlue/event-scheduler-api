// TS: express has no built-in type info, so req/res need explicit types here (imported as types only, since they're never used as values at runtime)
import { type Request, type Response } from "express";
import Event from "#models/Event";
import { eventSchema } from "#zod/eventSchema";

// get all events
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 20; // default cap if no ?limit= given
        const events = await Event.find().limit(limit);
        // `results` must always be present — the frontend reads data.results
        // unconditionally. `msg` is just additive, for readability, and the
        // frontend ignores it.
        if (!events.length) {
            res.status(200).json({ msg: "No events in the DB", results: events });
        } else {
            res.status(200).json({ msg: "Events found", results: events });
        }
    } catch (error) {
        res.status(500).json(error)
    }
};

// TODO: get one event
// - GET /events/:id
// - success response must be the RAW event object, not wrapped in { msg, event }
//   — EventDetails.jsx reads event.title/event.date/etc. directly off the response.
// - not-found case: use `message` as the key (not `msg`), since api.js only
//   reads data.error/data.message for its error text — a `msg` key would
//   silently never reach the user.

// TODO: create an event
// - POST /events, body validated with eventSchema.safeParse(req.body)
// - response shape is free to choose — CreateEventForm ignores the return
//   value entirely, so { msg, event } or the raw event both work fine.

// TODO: update an event
// - PUT /events/:id, body validated with eventSchema.safeParse(req.body)
// - not called by the frontend yet (no edit UI exists) — decide the response
//   shape (msg vs raw event vs both) once the edit feature is actually built,
//   so it matches whatever that feature ends up expecting.

// TODO: delete an event
// - DELETE /events/:id
// - not called by the frontend yet (no delete UI exists) — same as update,
//   decide the shape (msg vs 204 no body) once that feature exists.

// TODO: get upcoming events
// - GET /events/upcoming — must be registered BEFORE /:id in the router, or
//   Express/Mongoose will try to cast "upcoming" as an ObjectId and crash.
// - response must be a BARE array, not wrapped at all — fetchUpcoming calls
//   data.slice(0, 3) directly on the response, so { msg, results } would break
//   immediately (no message possible here, even additive).
// - query: date >= now, sorted ascending.