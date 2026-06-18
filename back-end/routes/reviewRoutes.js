import express from "express";
import {
  createReview,
  getReviewsByWorker,
  deleteReview,
} from "../controllers/reviewController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyRole(["user"]), createReview);
router.get("/worker/:workerId", getReviewsByWorker);
router.delete("/:reviewId", verifyToken, deleteReview);

export default router;
