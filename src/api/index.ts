import app from "../app";
import connectDB from "../config/database";

let isConnected = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log("✅ DB connected");
    }

    return app(req, res);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}