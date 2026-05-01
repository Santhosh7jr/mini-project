import express from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
} from "../controllers/favoriteController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addFavorite);
router.delete("/", verifyToken, removeFavorite);
router.get("/user/:userId", getFavorites);
router.get("/check/:userId/:workerId", isFavorite);

export default router;
