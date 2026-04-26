import mongoose from "mongoose";
import { config } from ".";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(config.mongoUri);

  return cached.conn;
};

export default connectDB;