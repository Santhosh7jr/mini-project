import express from "express";
import {
  getWorkersByServices,
  getAllWorkers,
  getPendingWorkers,
  approveWorker,
  deleteWorker,
  createWorkerProfile,
  getWorkerProfile,
  updateWorkerProfile,
} from "../controllers/workerController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createWorkerProfile);
router.patch("/:workerId", verifyToken, updateWorkerProfile);
router.get(
  "/approval/pending",
  verifyToken,
  verifyRole(["admin"]),
  getPendingWorkers,
);
router.patch(
  "/approval/approve/:workerId",
  verifyToken,
  verifyRole(["admin"]),
  approveWorker,
);
router.delete(
  "/approval/reject/:workerId",
  verifyToken,
  verifyRole(["admin"]),
  deleteWorker,
);
router.get("/service/:serviceId", getWorkersByServices);
router.get("/:workerId", getWorkerProfile);
router.get("/", getAllWorkers);
router.patch(
  "/approve/:workerId",
  verifyToken,
  verifyRole(["admin"]),
  approveWorker
);
router.delete("/:workerId", verifyToken, deleteWorker);

export default router;
