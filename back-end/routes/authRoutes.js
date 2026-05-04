import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.put("/update", verifyToken, updateProfile);

export default router;
