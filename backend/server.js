import express from "express"
import cors from "cors"
import { getPool } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoutes);

async function startServer() {
  try {
    await getPool();

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err.message);
    process.exit(1);
  }
}

startServer()