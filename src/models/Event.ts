//use mongoose to create the schema
import mongoose from "mongoose";

export interface IEvent {
  title: string;
  description?: string;
  date: Date;
  location: string;
  latitude?: number;
  longitude?: number;
}

// TS passing IEvent here makes TypeScript check that these fields actually match the interface
const EventSchema = new mongoose.Schema<IEvent>({
  title: {
    type: String,
    required: true,
    minLength: [3, "min length is 3 chars"],
    maxLength: [255, "max length is 255 chars"],
  },
  description: {
    type: String,
    required: false,
    minLength: [2, "min length is 2 chars"],
    maxLength: [255, "max length is 255 chars"],
  },
  location: {
    type: String,
    required: true,
    minLength: [2, "min length is 2 chars"],
    maxLength: [255, "max length is 255 chars"],
  },
  date: {
    type: Date,
    required: true,
  },
  latitude: {
    type: Number,
    required: false,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: false,
    min: -180,
    max: 180
  },
});

export default mongoose.model<IEvent>("Event", EventSchema);