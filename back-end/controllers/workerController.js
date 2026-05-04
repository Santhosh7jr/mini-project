import pool from "../config/db.js";

export const createWorkerProfile = async (req, res) => {
  const user_id = req.user.id;

  const { service_id, image, price, location, description, experience } =
    req.body;

  try {
    if (!service_id || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Check if worker profile already exists
    const existing = await pool.query(
      "SELECT * FROM workers WHERE user_id = $1",
      [user_id],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Worker profile already exists" });
    }

    const result = await pool.query(
      `INSERT INTO workers (user_id, service_id, image, price, location, description, experience) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        user_id,
        service_id,
        image || null,
        price,
        location || null,
        description || null,
        experience || 0,
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

export const approveWorker = async (req, res) => {
  const { workerId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE workers 
      SET is_approved = true 
      WHERE id = $1 
      RETURNING *`,
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

export const deleteWorker = async (req, res) => {
  const { workerId } = req.params;

  try {
    const existing = await pool.query(
      "SELECT user_id FROM workers WHERE id = $1",
      [workerId],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // 🔥 ONLY owner or admin
    if (existing.rows[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `DELETE FROM workers WHERE id = $1 RETURNING id`,
      [workerId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json({ message: "Worker Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
