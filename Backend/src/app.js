import dotenv from 'dotenv';
dotenv.config();

import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CORS || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true }));

//? Routes Import
import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/tasks", taskRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal server error",
    errors: err.errors || [],
  });
});

export default app;
