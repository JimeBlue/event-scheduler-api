import mongoose from "mongoose";

const connectDB = async () => {
  // read it into its own variable first so I can check it's actually set before using it
  const mongoUri = process.env.MONGODB_URI;

  // fail fast with a clear message instead of letting mongoose.connect crash on undefined
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  // mongoose.connect returns a promise that resolves once the connection is actually established
  const conn = await mongoose.connect(mongoUri);
  // conn.connection.name confirms which database we ended up connected to (useful to verify the URI is correct)
  console.log(`MongoDB connected successfully: ${conn.connection.name}`);
};

export default connectDB;
