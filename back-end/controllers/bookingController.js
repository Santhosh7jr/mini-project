import pool from "../config/db.js";

export const createBooking = async (req, res) => {
  const {
    user_id,
    worker_id,
    service_id,
    booking_date,
    booking_time,
    location,
    description,
    price,
  } = req.body;

  try {
    if (!user_id || !worker_id || !service_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, worker_id, service_id, booking_date, booking_time, location, description, price) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        user_id,
        worker_id,
        service_id,
        booking_date || null,
        booking_time || null,
        location || null,
        description || null,
        price || null,
      ],
    );

    res.status(201).json(result.rows[0]);
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
        w.price as worker_price,
        w.image as worker_image,
        w.rating,
        COALESCE(u.name, 'Unknown Worker') AS worker_name,
        s.name as service_name
      FROM bookings b
      LEFT JOIN workers w ON b.worker_id = w.id
      LEFT JOIN users u ON w.user_id = u.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC`,
      [Number(userId)],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWorkerBookings = async (req, res) => {
  const { workerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        b.*,
        u.name AS user_name,
        u.phone as user_phone,
        s.name as service_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.worker_id = $1
      ORDER BY b.created_at DESC`,
      [Number(workerId)],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = [
      "pending",
      "accepted",
      "completed",
      "rejected",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [status, bookingId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        b.*,
        u.name AS user_name,
        u.email as user_email,
        u.phone as user_phone,
        w.rating,
        w.image as worker_image,
        wu.name as worker_name,
        s.name as service_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN workers w ON b.worker_id = w.id
      LEFT JOIN users wu ON w.user_id = wu.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.id = $1`,
      [bookingId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
