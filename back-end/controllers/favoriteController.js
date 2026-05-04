import pool from "../config/db.js";

export const addFavorite = async (req, res) => {
  const user_id = req.user.id;
const { worker_id } = req.body;

  try {
    if (!worker_id) {
  return res.status(400).json({ message: "Missing required fields" });
}

    const result = await pool.query(
      `INSERT INTO favorites (user_id, worker_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, worker_id) DO NOTHING
       RETURNING *`,
      [user_id, worker_id],
    );

    res.status(201).json(result.rows[0] || { message: "Already favorited" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFavorite = async (req, res) => {
  const user_id = req.user.id;
const { worker_id } = req.body;

  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND worker_id = $2",
      [user_id, worker_id],
    );

    res.json({ message: "Favorite removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT w.*, u.name, s.name as service_name
       FROM favorites f
       JOIN workers w ON f.worker_id = w.id
       JOIN users u ON w.user_id = u.id
       LEFT JOIN services s ON w.service_id = s.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const isFavorite = async (req, res) => {
  const userId = req.user.id;
const { workerId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1 AND worker_id = $2",
      [userId, workerId],
    );

    res.json({ isFavorite: result.rows.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
