import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../services/auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res
      .status(201)
      .json({ success: true, message: "User registered", data: user });
  } catch (error) {
    console.log(error);
    if (error.message === "USER_EXISTS") {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const { accessToken, refreshToken } = await loginUser(email, password);

    res.cookie("jwt", refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ accessToken });
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function refresh(req, res) {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken)
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });

    const { newAccessToken, newRefreshToken } =
      await refreshUserToken(refreshToken);

    res.cookie("jwt", newRefreshToken, COOKIE_OPTIONS);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    const status =
      error.message === "FORBIDDEN" || error.message === "TOKEN_EXPIRED"
        ? 403
        : 500;
    res.status(status).json({ success: false, message: error.message });
  }
}

export async function logout(req, res) {
  try {
    const refreshToken = req.cookies?.jwt;
    if (refreshToken) {
      await logoutUser(refreshToken);
    }
    res.clearCookie("jwt", COOKIE_OPTIONS);
    res.status(204).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
