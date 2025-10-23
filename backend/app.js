import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimit from "express-rate-limit";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());




app.get("/", (req, res) => res.send("✅ AI Learning Assistant Backend Running"));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);



app.use(errorHandler);

export default app;
