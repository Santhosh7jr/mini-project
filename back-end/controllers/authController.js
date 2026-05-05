import pool from "../config/db.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

const getWorkerApprovalStatus = async (userId) => {
  const approvalResult = await pool.query(
    `SELECT worker_request_status
     FROM users
     WHERE id = $1`,
    [userId],
  );

  return approvalResult.rows[0]?.worker_request_status === "approved";
};

export const register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin registration is not allowed",
      });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role, worker_request_status)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, name, email, phone, role, worker_request_status`,
      [
        name,
        email,
        hashedPassword,
        phone || null,
        role || "user",
        role === "worker" ? "pending" : "none",
      ],
    );

    const user = result.rows[0];
    const worker_is_approved =
      user.role === "worker" ? await getWorkerApprovalStatus(user.id) : false;
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      token,
      user: { ...user, worker_is_approved },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const isAdminLogin = (email, password) => {
    return (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    );
  };

  try {
    const { email, password } = req.body;

    // 🔥 ADMIN LOGIN
    if (isAdminLogin(email, password)) {
      const adminUser = {
        id: 0,
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      };

      const token = generateToken(adminUser.id, adminUser.role);

      return res.json({ token, user: adminUser });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user.id, user.role);

    // Return user without password
    const worker_is_approved =
      user.role === "worker" ? await getWorkerApprovalStatus(user.id) : false;

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url,
      worker_request_status: user.worker_request_status || "none",
      worker_is_approved,
    };

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, role, avatar_url, worker_request_status FROM users WHERE id = $1",
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const worker_is_approved =
      user.role === "worker" ? await getWorkerApprovalStatus(user.id) : false;

    res.json({ ...user, worker_is_approved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, worker_request_status, created_at
       FROM users
       ORDER BY created_at DESC`,
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, name, email, phone, role`,
      [name, phone, req.user.id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};