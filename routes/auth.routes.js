import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  getUsers,
} from "../controllers/auth.controller.js";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refresh);

router.get("/users", getUsers);

router.get("/profile", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin route" });
});

export default router;
