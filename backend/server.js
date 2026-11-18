import "dotenv/config"; // must be first so .env is loaded before anything else
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
//cross origin resource sharing, allows the frontend to communicate with the backend
app.use(express.json());

app.get("/", (req, res) => res.send("Todo API is running"));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Error handler (must come after the routes)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body." });
  }
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));