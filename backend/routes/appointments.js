const express = require("express");
const { v4: uuid } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

// POST /api/appointments - book a visit appointment
router.post("/", (req, res) => {
  const { studentId, studentName, teacherId, date, time } = req.body;
  if (!studentId || !teacherId || !date || !time) {
    return res.status(400).json({ message: "studentId, teacherId, date and time are required" });
  }

  const db = readDB();
  const teacher = db.teachers.find((t) => t.id === teacherId);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const appointmentCode = `APT-${db.nextAppointmentSeq}`;
  db.nextAppointmentSeq += 1;

  const appointment = {
    id: uuid(),
    appointmentCode,
    studentId,
    studentName: studentName || "Student",
    teacherId,
    teacherName: teacher.name,
    date,
    time,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.appointments.push(appointment);
  teacher.totalAppointments = (teacher.totalAppointments || 0) + 1;
  writeDB(db);

  res.status(201).json({ appointment, teacher });
});

// GET /api/appointments/:id - single appointment (used by confirmation page)
router.get("/:id", (req, res) => {
  const db = readDB();
  const appt = db.appointments.find((a) => a.id === req.params.id);
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  const teacher = db.teachers.find((t) => t.id === appt.teacherId);
  res.json({ appointment: appt, teacher });
});

// GET /api/appointments/student/:studentId
router.get("/student/:studentId", (req, res) => {
  const db = readDB();
  const list = db.appointments
    .filter((a) => a.studentId === req.params.studentId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ appointments: list });
});

// GET /api/appointments/teacher/:teacherId
router.get("/teacher/:teacherId", (req, res) => {
  const db = readDB();
  const list = db.appointments
    .filter((a) => a.teacherId === req.params.teacherId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json({ appointments: list });
});

// PUT /api/appointments/:id/status - teacher confirms/cancels/completes
router.put("/:id/status", (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `status must be one of ${validStatuses.join(", ")}` });
  }

  const db = readDB();
  const appt = db.appointments.find((a) => a.id === req.params.id);
  if (!appt) return res.status(404).json({ message: "Appointment not found" });

  appt.status = status;
  writeDB(db);
  res.json({ appointment: appt });
});

module.exports = router;
