import express from "express";
import {
  register,
  login,
  getMe,
  getAllUsers,
} from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/authController.js";
import { verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.get("/users", verifyToken, verifyRole(["admin"]), getAllUsers);
router.put("/update", verifyToken, updateProfile);

export default router;
