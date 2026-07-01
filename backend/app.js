import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: [
    "https://econ-pulse-six.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
  ],
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use("/", routes);
app.use(errorHandler);

export default app;
