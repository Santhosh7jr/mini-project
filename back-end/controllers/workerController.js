import pool from "../config/db.js";

export const getWorkersByServices = async (req, res) => {

  const { serviceId } = req.params;

  try {
    const result = await pool.query(
      "SELECT w.*, u.name FROM workers w JOIN users u ON w.user_id = u.id WHERE w.service_id = $1 AND w.is_approved = true",
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
      `SELECT w.*, u.name 
      FROM workers w 
      JOIN users u ON w.user_id = u.id`
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({message : "Server error"});
  }

};

export const approveWorker = async (req, res) => {
  const {workerId} = req.params;

  try {
    const result = await pool.query(
      `UPDATE workers 
      SET is_approved = true 
      WHERE id = $1 
      RETURNING *`,
      [workerId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({message : "Server error"});
  }
};

export const deleteWorker = async (req, res) => {
  const {workerId} = req.params;

  try {
    await pool.query(
      `DELETE FROM workers WHERE id = $1`,
      [workerId]
    );

    res.json({message : "Worker Deleted"});
  } catch (error) {
    console.log(error);
    res.status(500).json({message : "Server error"});
  }
};