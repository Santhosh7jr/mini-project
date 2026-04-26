import express from "express";
import {getWorkersByServices, getAllWorkers, approveWorker, deleteWorker} from "../controllers/workerController.js";

const router = express.Router();

router.get("/:serviceId", getWorkersByServices);
router.get("/", getAllWorkers);
router.patch("/approve/:workerId", approveWorker);
router.delete("/:workerId", deleteWorker);

export default router;