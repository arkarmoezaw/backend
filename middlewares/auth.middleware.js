import jwt from "jsonwebtoken";

export async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied: No Token Provided!" });
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = verified;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }
    next();
  };
}
