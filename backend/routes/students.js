const express = require("express");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

// GET /api/students/:id - profile
router.get("/:id", (req, res) => {
  const db = readDB();
  const student = db.users.find((u) => u.id === req.params.id && u.role === "student");
  if (!student) return res.status(404).json({ message: "Student not found" });
  const { password, ...safe } = student;
  res.json({ student: safe });
});

// PUT /api/students/:id - update profile (name, phone)
router.put("/:id", (req, res) => {
  const db = readDB();
  const student = db.users.find((u) => u.id === req.params.id && u.role === "student");
  if (!student) return res.status(404).json({ message: "Student not found" });

  const { name, phone } = req.body;
  if (name !== undefined) student.name = name;
  if (phone !== undefined) student.phone = phone;
  writeDB(db);

  const { password, ...safe } = student;
  res.json({ student: safe });
});

// GET /api/students/:id/favorites - full teacher objects
router.get("/:id/favorites", (req, res) => {
  const db = readDB();
  const teacherIds = db.favorites
    .filter((f) => f.studentId === req.params.id)
    .map((f) => f.teacherId);
  const teachers = db.teachers.filter((t) => teacherIds.includes(t.id));
  res.json({ teachers });
});

// POST /api/students/:id/favorites - body { teacherId }
router.post("/:id/favorites", (req, res) => {
  const { teacherId } = req.body;
  if (!teacherId) return res.status(400).json({ message: "teacherId is required" });

  const db = readDB();
  const exists = db.favorites.find(
    (f) => f.studentId === req.params.id && f.teacherId === teacherId
  );
  if (!exists) {
    db.favorites.push({ studentId: req.params.id, teacherId });
    writeDB(db);
  }
  res.status(201).json({ message: "Added to favorites" });
});

// DELETE /api/students/:id/favorites/:teacherId
router.delete("/:id/favorites/:teacherId", (req, res) => {
  const db = readDB();
  db.favorites = db.favorites.filter(
    (f) => !(f.studentId === req.params.id && f.teacherId === req.params.teacherId)
  );
  writeDB(db);
  res.json({ message: "Removed from favorites" });
});

module.exports = router;
