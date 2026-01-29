import { getPool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";


dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

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

// POST /api/auth/login
export const login = async (req, res) => {
  const { mobile, password } = req.body || {};

  if (!mobile || !password) {
    return res.status(400).json({ error: "Mobile and password are required" });
  }

  try {
    const pool = await getPool();

    // fetch user by mobile
    const selectSql =
      "SELECT id, name, mobile, email, password, created_at FROM dbo.users WHERE mobile = ?";

    const result = await pool.promises.query(selectSql, [mobile]);
    const rows = result.first || result.results?.[0] || [];

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    // check account age: must be within 1 year of createdAt
    if (user.createdAt) {
      const createdAt = new Date(user.createdAt);
      const expiry = new Date(createdAt);
      expiry.setFullYear(expiry.getFullYear() + 1);

      if (new Date() > expiry) {
        return res
          .status(403)
          .json({ error: "Account access expired (older than 1 year)" });
      }
    }

//     if (user.created_at) {
//   const created_at = new Date(user.created_at);

//   // Add 30 minutes to account creation time
//   const expiry = new Date(created_at.getTime() + 2 * 60 * 1000);

//   if (new Date() > expiry) {
//     return res
//       .status(403)
//       .json({ error: "Account access expired (after 2 minutes)" });
//   }
// }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, mobile: user.mobile },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};
