import { getPool } from "../config/db.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, mobile, email, password } = req.body || {};

  // Basic validation
  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const pool = await getPool();

    // generate UUID v4 for user id
    const id = uuidv4();

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user into dbo.users
    // NOTE: adjust column names/types if your table uses different ones
    const insertSql =
      "INSERT INTO dbo.users (id, name, mobile, email, password) VALUES (?, ?, ?, ?, ?)";

    await pool.promises.query(insertSql, [
      id,
      name,
      mobile,
      email,
      hashedPassword,
    ]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};
