import pool from "../config/db.js";

export const getServices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({message : "Server error"});
  }
};