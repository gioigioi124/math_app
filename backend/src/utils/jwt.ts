import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};
