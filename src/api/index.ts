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
  await init();
  return app(req, res);
};