const express = require("express");
const { v4: uuid } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

// POST /api/auth/register
// Simple dummy registration - no hashing, no verification, no OTP.
router.post("/register", (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "name, email, password and role are required" });
  }
  if (!["student", "teacher"].includes(role)) {
    return res.status(400).json({ message: "role must be 'student' or 'teacher'" });
  }

  const db = readDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const newUser = {
    id: uuid(),
    role,
    name,
    email,
    password, // dummy - stored in plain text on purpose for this prototype
    phone: phone || "",
  };
  db.users.push(newUser);

  // If registering as a teacher, create a blank-ish teacher profile too
  if (role === "teacher") {
    const newProfile = {
      id: uuid(),
      userId: newUser.id,
      name,
      photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      images: [],
      subjects: [],
      classes: [],
      qualifications: "",
      experienceYears: 0,
      location: "",
      address: "",
      contact: phone || "",
      fees: 0,
      batchSize: 0,
      availableSeats: 0,
      description: "",
      batchTimings: [],
      rating: 0,
      studentsTaught: 0,
      profileViews: 0,
      totalAppointments: 0,
      reviews: [],
    };
    db.teachers.push(newProfile);
    newUser.teacherProfileId = newProfile.id;
  }

  writeDB(db);

  const { password: _pw, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser });
});

// POST /api/auth/login
// Dummy login - just checks email + password match in the JSON "database".
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === (email || "").toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const { password: _pw, ...safeUser } = user;
  res.json({ user: safeUser });
});

module.exports = router;
