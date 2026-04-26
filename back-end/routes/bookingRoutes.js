import express from "express";
import { createBooking, getUserBookings, getWorkerBookings, updateBookingStatus } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/user/:userId", getUserBookings);
router.get("/worker/:workerId", getWorkerBookings);
router.patch("/:bookingId", updateBookingStatus);

export default router;