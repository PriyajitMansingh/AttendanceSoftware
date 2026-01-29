import express from "express"
import { register, login } from "../controllers/authController.js"

const router = express.Router()

// POST /api/auth/register - signup
router.post("/register", register)

// POST /api/auth/login - login with JWT
router.post("/login", login)

export default router