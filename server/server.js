import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Add this
import connectDB from "./config/mongodb.js";
import userRoutes from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

dotenv.config();
const app = express();
const PORT = 4000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Enable CORS for all origins (development)
app.use(cors());

// ✅ Parse JSON body
app.use(express.json());

// ✅ Mount routes
app.use("/api/user", userRoutes);
app.use("/api/image", imageRouter);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API Working fine");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
