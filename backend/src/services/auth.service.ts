import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const registerUser = async (userData: any) => {
  const { email } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const user = await User.create(userData);
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id as string),
  };
};

export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;
  const user: any = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id as string),
    };
  }
  throw new Error("Invalid email or password");
};

import bcrypt from "bcryptjs";
