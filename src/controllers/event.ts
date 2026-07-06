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

// Get one event --> GET /events/:id
// - success response must be the RAW event object, not wrapped in { msg, event } becasue EventDetails.jsx reads event.title/event.date/etc. directly off the response.
// - not-found case: use `message` as the key (not `msg`), since api.js only reads data.error/data.message for its error text — a `msg` key would
//   silently never reach the user.

export const getOneEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (event) {
            return res.status(200).json(event);
        }
        res.status(404).json({message: "I could not find that event :("})
    } catch (error) {
        res.status(500).json(error);
    }
}

// Create an event
// - POST /events, body validated with eventSchema.safeParse(req.body)
// - response shape is free to choose — CreateEventForm ignores the return
//   value entirely, so { msg, event } or the raw event both work fine.


export const createEvent = async (req: Request, res: Response) => {
    try {
         // TS: validate req.body before trusting it, since req.body has no guaranteed shape at runtime
        const result = eventSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({message: "Invalid event data", errors: result.error.issues});
        }
    const { title, description, date, location, latitude, longitude } = result.data;
    const event = await Event.create ({title, description, date, location, latitude, longitude});
    res.status(201).json({message: "event created successfully", event})
    } catch (error) {
        res.status(500).json(error);
    }
}

// Update an event --> PUT /events/:id
// - success: { message, event } 
// - not found: { message } (404) 

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // TS: validate req.body before trusting it, since req.body has no guaranteed shape at runtime
        const result = eventSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ message: "Invalid event data", errors: result.error.issues });
        }

        const { title, description, date, location, latitude, longitude } = result.data;

        const event = await Event.findByIdAndUpdate(
            id,
            { title, description, date, location, latitude, longitude },
            { returnDocument: "after" },
        );

        if (!event) {
            return res.status(404).json({ message: "I could not find that event :(" });
        }

        res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete an event --> DELETE /events/:id
// - success: { message, event } — same shape as createEvent/updateEvent
// - not found: { message } (404)

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ message: "I could not find that event :(" });
        }

        res.status(200).json({ message: "Event deleted successfully", event });
    } catch (error) {
        res.status(500).json(error);
    }
};

// TODO: get upcoming events
// - GET /events/upcoming — must be registered BEFORE /:id in the router, or
//   Express/Mongoose will try to cast "upcoming" as an ObjectId and crash.
// - response must be a BARE array, not wrapped at all — fetchUpcoming calls
//   data.slice(0, 3) directly on the response, so { msg, results } would break
//   immediately (no message possible here, even additive).
// - query: date >= now, sorted ascending.