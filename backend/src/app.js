import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to CodeSage API" });
});
app.get("/health", (req, res) => {
  res.json({ message: "Back-end is sucssfully working!" });
});

app.use("/api/auth", authRoutes);
export default app;
