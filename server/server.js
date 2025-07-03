import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import userRoutes from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

dotenv.config();
const app = express();
const PORT = 4000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Enable CORS for frontend domain only
app.use(cors({
  origin: ["https://imagify-viso.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/image", imageRouter);

app.get("/", (req, res) => {
  res.send("API Working fine");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
