import pool from "../config/db.js";

export const createBooking = async (req, res) => {
  const { user_id, worker_id, service_id, location } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO bookings (user_id, worker_id, service_id, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, worker_id, service_id, location],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};

export const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT
      b.*,
      COALESCE(u.name, 'Unknown Worker') AS worker_name
   FROM bookings b
   LEFT JOIN workers w ON b.worker_id = w.id
   LEFT JOIN users u ON w.user_id = u.id
   WHERE b.user_id = $1`,
      [Number(userId)],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWorkerBookings = async (req, res) => {

  const {workerId} = req.params;

  try {

    const result = await pool.query(
      `SELECT b.*, u.name AS user_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.worker_id = $1`,
      [Number(workerId)]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({message : "Server error"});
  }

};

export const updateBookingStatus = async (req, res) => {

  const {bookingId} = req.params;
  const {status} = req.body;

  try {

    const result = await pool.query(
      `UPDATE bookings 
      SET status = $1 
      WHERE id = $2 
      RETURNING *`,
      [status, bookingId]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({message : "Server error"});
  }

};