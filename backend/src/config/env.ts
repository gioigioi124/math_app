import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/math_app",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  nodeEnv: process.env.NODE_ENV || "development",
};
