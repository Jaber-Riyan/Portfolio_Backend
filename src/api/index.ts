import app from "../app/app";
import connectDB from "../config/database";

let isConnected = false;

const init = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

export default async (req: any, res: any) => {
  try {
    await init();
    return app(req, res);
  } catch (err: any) {
    // Log and return a 500 instead of crashing the function
    console.error('Server initialization error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Server initialization error' }));
  }
};