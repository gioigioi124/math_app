import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const registerUser = async (userData: any) => {
  const { phone, childName } = userData;

  // Check if user already exists by phone
  const userExists = await User.findOne({ phone });
  if (userExists) throw new Error("Số điện thoại đã được đăng ký");

  // Create user with type 'user' (not guest)
  const user = await User.create({
    ...userData,
    type: "user",
    childName,
    phone,
  });

  return {
    _id: user._id,
    childName: user.childName,
    phone: user.phone,
    grade: user.grade,
    type: user.type,
    token: generateToken(user._id.toString()),
  };
};

export const loginUser = async (credentials: any) => {
  const { phone, password } = credentials;
  const user: any = await User.findOne({ phone });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user._id,
      childName: user.childName,
      phone: user.phone,
      grade: user.grade,
      type: user.type,
      avatar: user.avatar,
      coins: user.coins,
      xp: user.xp,
      level: user.level,
      token: generateToken(user._id.toString()),
    };
  }
  throw new Error("Số điện thoại hoặc mật khẩu không đúng");
};
