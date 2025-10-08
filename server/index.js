import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS configuration (allow Vite frontend)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Configure MariaDB connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Utility function for queries
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ✅ Test connection on startup
pool
  .getConnection()
  .then(() => console.log("✅ Connected to MariaDB"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

/* ---------------------- ROUTES ---------------------- */

// 📰 NEWS
app.get("/api/news", async (req, res) => {
  try {
    const rows = await query(`
      SELECT 
        id, slug, title, subtitle, body_html, author, publication_date, is_featured,
        categories, tags, created_at, updated_at
      FROM news
      ORDER BY publication_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// 📝 BLOG POSTS
app.get("/api/blog", async (req, res) => {
  try {
    const rows = await query(`
      SELECT id, slug, title, subtitle, body_html, author, publication_date
      FROM blogposts
      ORDER BY publication_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching blogposts:", err);
    res.status(500).json({ error: "Failed to fetch blogposts" });
  }
});

// 🎟️ EVENTS
app.get("/api/events", async (req, res) => {
  try {
    const rows = await query(`
      SELECT id, slug, title, description_html, event_date, event_time, location, banner_image_url, capacity
      FROM events
      ORDER BY event_date ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 🤝 SPONSORS
app.get("/api/sponsors", async (req, res) => {
  try {
    const rows = await query(`
      SELECT id, name, logo_url, description, website_url, display_order
      FROM sponsors
      WHERE is_active = 1
      ORDER BY display_order ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching sponsors:", err);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

// 📬 CONTACT FORM
app.post("/api/forms/submit", async (req, res) => {
  const { formId, ...formData } = req.body;
  if (!formId) {
    return res.status(400).json({ success: false, error: "Missing formId" });
  }

  try {
    await query(
      `INSERT INTO contact_submissions (uniqueness_check, form_data, created_at)
       VALUES (?, ?, NOW())`,
      [formId, JSON.stringify(formData)]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving contact form:", err);
    res.status(500).json({ success: false, error: "Failed to submit form" });
  }
});

// 👤 Mock user route
app.get("/api/users/me", (req, res) => {
  res.json({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  });
});

/* ---------------------- SERVER ---------------------- */

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Backend running on http://127.0.0.1:${PORT}`)
);