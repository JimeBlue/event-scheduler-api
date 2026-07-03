import express from "express";
import cors from "cors";
import connectDB from "./dbinit.ts";

// Initialize the Express application instance
const app = express();

// connect mongoDB
await connectDB();

const port = process.env.PORT || 8080;

// middleware
app.use(express.json()); // this one is for whenever we need to run json and send it back and forth in our requests
app.use(cors()); // allow requests from other origins (e.g. a frontend running on a different port)

// app.get--> 2 arguments: where (location) and what (request and response)
app.get("/", (req, res) => {
  res.send("hello world");
});

// mount your resource routers here, e.g.:
// import events from "#routes/events";
// app.use("/api/v1/events", events);

// listen expects a port, which was declared at top, and a callback function
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
