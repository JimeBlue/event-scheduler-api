// TS: express has no built-in type info, so req/res need explicit types here (imported as types only, since they're never used as values at runtime)
import { type Request, type Response } from "express";
import Event from "#models/Event";
import { eventSchema } from "#zod/eventSchema";

// get all events
// TODO: add all pagination metadata as the WBS school event scheduler api?

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find();
        if (!events.length) {
            res.status(200).json({msg: "No events in the DB"});
        } else
        res.status(200).json({events})
    } catch (error) {
        res.status(500).json(error)
    }
};

// TODO: 
// get one event

// create an event

// update an event

// delete an event

// get upcoming events 