const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");

router.get("/events", async (req, res) => {
  const { search = "", category = "", location = "" } = req.query;
  const db = req.db;

  let query = `SELECT * FROM event WHERE (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)`;
  let params = [`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }
  if (location) {
    query += ` AND location = ?`;
    params.push(location);
  }

  try {
    const events = await db.all(query, params);
    res.send(events);
  } catch (err) {
    res.status(500).send("Error fetching events");
  }
});

router.post("/register", authenticate, async (req, res) => {
  const { eventId } = req.body;
  const userId = req.userId;
  const db = req.db;

  try {
    const alreadyReg = await db.get(
      `SELECT * FROM registration WHERE user_id = ? AND event_id = ?`,
      [userId, eventId],
    );
    if (alreadyReg) return res.status(400).send("Already registered");

    const event = await db.get(`SELECT capacity FROM event WHERE id = ?`, [
      eventId,
    ]);
    if (!event) return res.status(404).send("Event not found");

    const currentReg = await db.get(
      `SELECT count(*) as count FROM registration WHERE event_id = ?`,
      [eventId],
    );

    if (currentReg.count >= event.capacity) {
      return res.status(400).send("Event is full");
    }

    await db.run(`INSERT INTO registration (user_id, event_id) VALUES (?, ?)`, [
      userId,
      eventId,
    ]);
    res.send("Registered successfully");
  } catch (err) {
    res.status(500).send("Registration failed");
  }
});

router.get("/dashboard", authenticate, async (req, res) => {
  const db = req.db;
  try {
    const myEvents = await db.all(
      `SELECT event.* FROM event 
       INNER JOIN registration ON event.id = registration.event_id 
       WHERE registration.user_id = ?`,
      [req.userId],
    );
    res.send(myEvents);
  } catch (err) {
    res.status(500).send("Error fetching dashboard data");
  }
});

router.delete("/cancel/:eventId", authenticate, async (req, res) => {
  const db = req.db;
  try {
    await db.run(
      `DELETE FROM registration WHERE user_id = ? AND event_id = ?`,
      [req.userId, req.params.eventId],
    );
    res.send("Registration cancelled");
  } catch (err) {
    res.status(500).send("Cancellation failed");
  }
});

router.get("/seed", async (req, res) => {
  const db = req.db;
  try {
    await db.run(`DELETE FROM event`);

    await db.run(`INSERT INTO event (name, organizer, location, date, description, capacity, category) VALUES 
      ('Tech Meetup', 'BellCorp', 'New York', '2025-10-10', 'A cool tech talk', 50, 'Technology'),
      ('Art Workshop', 'Creative Co', 'London', '2025-12-05', 'Learn to paint', 2, 'Art'),
      ('Music Fest', 'RockStar', 'Mumbai', '2026-01-01', 'Live music fest', 100, 'Music')`);
    res.send("Data seeded successfully!");
  } catch (err) {
    res.status(500).send("Seeding failed: " + err.message);
  }
});

module.exports = router;
