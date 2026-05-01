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
router.get("/user/:userId", getUserBookings);
router.get("/worker/:workerId", getWorkerBookings);
router.get("/:bookingId", getBookingDetails);
router.patch("/:bookingId", verifyToken, updateBookingStatus);

export default router;
