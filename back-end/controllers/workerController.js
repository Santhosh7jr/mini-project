import pool from "../config/db.js";

export const createWorkerProfile = async (req, res) => {
  const user_id = req.user.id;

  const { service_id, image, price, location, description, experience } =
    req.body;

  try {
    if (!service_id || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await pool.query(
      "SELECT role, worker_request_status FROM users WHERE id = $1",
      [user_id],
    );

    if (user.rows.length === 0 || user.rows[0].role !== "worker") {
      return res
        .status(403)
        .json({ message: "Only workers can create a profile" });
    }

    // Check if worker profile already exists
    const existing = await pool.query(
      "SELECT * FROM workers WHERE user_id = $1",
      [user_id],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Worker profile already exists" });
    }

    const isApproved = user.rows[0].worker_request_status === "approved";

    const result = await pool.query(
      `INSERT INTO workers (user_id, service_id, image, price, location, description, experience, is_approved) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        user_id,
        service_id,
        image || null,
        price,
        location || null,
        description || null,
        experience || 0,
        isApproved,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWorkerProfile = async (req, res) => {
  const { workerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT w.*, u.name, u.email, u.phone 
       FROM workers w 
       JOIN users u ON w.user_id = u.id 
       WHERE w.id = $1`,
      [workerId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateWorkerProfile = async (req, res) => {
  const { workerId } = req.params;
  const {
    image,
    price,
    location,
    description,
    experience,
    availability_status,
  } = req.body;

  try {
    const existing = await pool.query(
      "SELECT user_id FROM workers WHERE id = $1",
      [workerId],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // 🔥 NEW CHECK
    if (existing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `UPDATE workers 
       SET image = COALESCE($1, image), 
           price = COALESCE($2, price), 
           location = COALESCE($3, location), 
           description = COALESCE($4, description),
           experience = COALESCE($5, experience),
           availability_status = COALESCE($6, availability_status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [
        image,
        price,
        location,
        description,
        experience,
        availability_status,
        workerId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWorkersByServices = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const result = await pool.query(
      `SELECT w.*, u.name, s.name as service_name
       FROM workers w 
       JOIN users u ON w.user_id = u.id 
       LEFT JOIN services s ON w.service_id = s.id
       WHERE w.service_id = $1 AND w.is_approved = true
       ORDER BY w.rating DESC`,
      [serviceId],
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

export const getAllWorkers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, u.name, s.name as service_name
      FROM workers w 
      JOIN users u ON w.user_id = u.id
      LEFT JOIN services s ON w.service_id = s.id
      ORDER BY w.rating DESC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPendingWorkers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.worker_request_status,
        u.created_at
       FROM users u
       WHERE u.role = 'worker'
         AND u.worker_request_status = 'pending'
       ORDER BY u.created_at DESC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveWorker = async (req, res) => {
  const { workerId: userId } = req.params;

  try {
    const userResult = await pool.query(
      `UPDATE users
       SET worker_request_status = 'approved'
       WHERE id = $1 AND role = 'worker'
       RETURNING id, name, email, role, worker_request_status`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Worker request not found" });
    }

    await pool.query(
      `UPDATE workers
       SET is_approved = true
       WHERE user_id = $1`,
      [userId],
    );

    res.json(userResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteWorker = async (req, res) => {
  const { workerId: userId } = req.params;

  try {
    const existingUser = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [userId],
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 ONLY owner or admin
    if (Number(userId) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `UPDATE users
       SET role = 'user',
           worker_request_status = 'rejected'
       WHERE id = $1
       RETURNING id, name, email, role, worker_request_status`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Worker request not found" });
    }

    await pool.query(
      `DELETE FROM workers WHERE user_id = $1`,
      [userId],
    );

    res.json({ message: "Worker request rejected", user: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
