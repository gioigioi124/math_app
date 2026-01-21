import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";

// Routes
import authRoutes from "./routes/auth.route";
import lessonRoutes from "./routes/lesson.route";
import progressRoutes from "./routes/progress.route";
import leaderboardRoutes from "./routes/leaderboard.route";
import shopRoutes from "./routes/shop.route";
import guestRoutes from "./routes/guest.route";

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/shop", shopRoutes);

// Error Handling
app.use(errorMiddleware);

export default app;
