import express from "express";
import {
  createReview,
  getReviewsByWorker,
  deleteReview,
} from "../controllers/reviewController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/worker/:workerId", getReviewsByWorker);
router.delete("/:reviewId", verifyToken, deleteReview);

export default router;
