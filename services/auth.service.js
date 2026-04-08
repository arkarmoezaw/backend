import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { signToken } from "../utils/utils.js";

export const registerUser = async (email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("USER_EXISTS");

  const user = await User.create({ email, password });
  return { id: user._id, email: user.email };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload = { userId: user._id, role: user.role };
  const accessToken = signToken(payload, process.env.ACCESS_TOKEN, "10m");
  const refreshToken = signToken(payload, process.env.REFRESH_TOKEN, "7d");

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const refreshUserToken = async refreshToken => {
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("FORBIDDEN");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  } catch (err) {
    throw new Error("TOKEN_EXPIRED");
  }

  if (user._id.toString() !== decoded.userId) throw new Error("FORBIDDEN");

  const payload = { userId: user._id, role: user.role };
  const newAccessToken = signToken(payload, process.env.ACCESS_TOKEN, "10m");
  const newRefreshToken = signToken(payload, process.env.REFRESH_TOKEN, "7d");

  user.refreshToken = newRefreshToken;
  await user.save();

  return { newAccessToken, newRefreshToken };
};

export const logoutUser = async refreshToken => {
  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = "";
    await user.save();
  }
};
