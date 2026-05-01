import express from "express";
import {
  getWorkersByServices,
  getAllWorkers,
  approveWorker,
  deleteWorker,
  createWorkerProfile,
  getWorkerProfile,
  updateWorkerProfile,
} from "../controllers/workerController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createWorkerProfile);
router.get("/:workerId", getWorkerProfile);
router.patch("/:workerId", verifyToken, updateWorkerProfile);
router.get("/service/:serviceId", getWorkersByServices);
router.get("/", getAllWorkers);
router.patch("/approve/:workerId", verifyToken, approveWorker);
router.delete("/:workerId", verifyToken, deleteWorker);

export default router;
