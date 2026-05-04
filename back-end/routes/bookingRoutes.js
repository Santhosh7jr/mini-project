import express from "express";
import {
  createBooking,
  getUserBookings,
  getWorkerBookings,
  updateBookingStatus,
  getBookingDetails,
} from "../controllers/bookingController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);

// ✅ Specific routes before parameterized routes
router.get("/my", verifyToken, getUserBookings);
router.get("/worker/:workerId", verifyToken, getWorkerBookings);

// ✅ Parameterized routes after specific ones
router.get("/user/:userId", getUserBookings);
router.get("/:bookingId", verifyToken, getBookingDetails);

router.patch("/:bookingId", verifyToken, updateBookingStatus);

export default router;
