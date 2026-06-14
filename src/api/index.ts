import serverless from "serverless-http";
import app from "../app/app";
import connectDB from "../config/database";

let handler: serverless.Handler | null = null;
let isConnected = false;

async function initializeHandler(): Promise<serverless.Handler> {
  if (!handler) {
    handler = serverless(app);
  }
  return handler;
}

export default async (req: any, res: any) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    const h = await initializeHandler();
    await h(req, res);
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