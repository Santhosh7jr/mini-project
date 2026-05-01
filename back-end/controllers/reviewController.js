import pool from "../config/db.js";

export const createReview = async (req, res) => {
  const { user_id, worker_id, booking_id, rating, comment } = req.body;

  try {
    if (!user_id || !worker_id || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, worker_id, booking_id, rating, comment) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [user_id, worker_id, booking_id || null, rating, comment || null],
    );

    // Update worker rating
    await updateWorkerRating(worker_id);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsByWorker = async (req, res) => {
  const { workerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.worker_id = $1 
       ORDER BY r.created_at DESC`,
      [workerId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateWorkerRating = async (workerId) => {
  try {
    const result = await pool.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as count
       FROM reviews 
       WHERE worker_id = $1`,
      [workerId],
    );

    const avgRating = result.rows[0].avg_rating || 4.5;
    const count = result.rows[0].count || 0;

    await pool.query(
      `UPDATE workers 
       SET rating = $1, reviews_count = $2 
       WHERE id = $3`,
      [parseFloat(avgRating).toFixed(1), count, workerId],
    );
  } catch (error) {
    console.error(error);
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await pool.query(
      "SELECT worker_id FROM reviews WHERE id = $1",
      [reviewId],
    );

    if (review.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);

    // Update worker rating
    await updateWorkerRating(review.rows[0].worker_id);

    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
