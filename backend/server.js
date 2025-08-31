import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";
import authRoutes from "./routes/auth.js";  // ✅ new

const app = express();
const PORT = 5007;

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);   // ✅ signup/login routes

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
