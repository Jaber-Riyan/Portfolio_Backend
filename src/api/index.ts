import serverless from "serverless-http";
import app from "../app/app";
import connectDB from "../config/database";

let isConnected = false;

const handler = serverless(app);

export default async (req: any, res: any) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    return handler(req, res);
  } catch (err) {
    console.error("Server error:", err);

    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
      })
    );
  }
};