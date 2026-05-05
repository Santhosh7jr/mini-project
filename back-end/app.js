import express from "express";
import cors from "cors";
import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

const ensureWorkerRequestStatusColumn = async () => {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS worker_request_status VARCHAR(20) DEFAULT 'none'
      CHECK (worker_request_status IN ('none', 'pending', 'approved', 'rejected'))
    `);

    await pool.query(`
      UPDATE users u
      SET worker_request_status = CASE
            WHEN EXISTS (
              SELECT 1
              FROM workers w
              WHERE w.user_id = u.id
                AND w.is_approved = true
            ) THEN 'approved'
            ELSE 'pending'
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE u.role = 'worker'
        AND u.worker_request_status = 'none'
    `);
  } catch (error) {
    console.error("Failed to ensure worker request status column:", error);
  }
};

ensureWorkerRequestStatusColumn();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Karigo API running..." });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
