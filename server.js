import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

import routes from "./routes/index.routes.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  if (dbStatus === "Connected") {
    res.status(200).json({
      status: "UP",
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: "DOWN",
      database: dbStatus,
    });
  }
});

app.use("/api/v1", routes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 10000}...`);
});
