const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "eventApp.db");
let db = null;

const initializeServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      );

      CREATE TABLE IF NOT EXISTS event (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        organizer TEXT,
        location TEXT,
        date TEXT,
        description TEXT,
        capacity INTEGER,
        category TEXT
      );

      CREATE TABLE IF NOT EXISTS registration (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        event_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (event_id) REFERENCES event(id)
      );
    `);

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use("/auth", authRoutes);
    app.use("/api", eventRoutes);

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(`Error: ${e.message}`);
    process.exit(1);
  }
};

initializeServer();
