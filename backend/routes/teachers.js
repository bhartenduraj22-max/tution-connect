const express = require("express");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

// GET /api/teachers - browse & filter/search
// Query params: subject, location, class, minFees, maxFees, minExperience, minRating, q
router.get("/", (req, res) => {
  const db = readDB();
  let { subject, location, class: cls, minFees, maxFees, minExperience, minRating, q } = req.query;
  let results = db.teachers;

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.subjects.some((s) => s.toLowerCase().includes(query)) ||
        t.location.toLowerCase().includes(query)
    );
  }
  if (subject) {
    results = results.filter((t) =>
      t.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())
    );
  }
  if (location) {
    results = results.filter((t) => t.location.toLowerCase().includes(location.toLowerCase()));
  }
  if (cls) {
    results = results.filter((t) => t.classes.includes(cls));
  }
  if (minFees) {
    results = results.filter((t) => t.fees >= Number(minFees));
  }
  if (maxFees) {
    results = results.filter((t) => t.fees <= Number(maxFees));
  }
  if (minExperience) {
    results = results.filter((t) => t.experienceYears >= Number(minExperience));
  }
  if (minRating) {
    results = results.filter((t) => t.rating >= Number(minRating));
  }

  res.json({ count: results.length, teachers: results });
});

// GET /api/teachers/meta/options - distinct subjects/locations/classes for filter dropdowns
router.get("/meta/options", (req, res) => {
  const db = readDB();
  const subjects = [...new Set(db.teachers.flatMap((t) => t.subjects))].sort();
  const locations = [...new Set(db.teachers.map((t) => t.location))].sort();
  const classes = [...new Set(db.teachers.flatMap((t) => t.classes))].sort();
  res.json({ subjects, locations, classes });
});

// GET /api/teachers/:id - profile page (increments profileViews)
router.get("/:id", (req, res) => {
  const db = readDB();
  const teacher = db.teachers.find((t) => t.id === req.params.id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  teacher.profileViews += 1;
  writeDB(db);

  res.json({ teacher });
});

// GET /api/teachers/by-user/:userId - teacher fetching their own profile for dashboard
router.get("/by-user/:userId", (req, res) => {
  const db = readDB();
  const teacher = db.teachers.find((t) => t.userId === req.params.userId);
  if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });
  res.json({ teacher });
});

// PUT /api/teachers/:id - update teacher profile (dummy - no auth check beyond ownership by id)
router.put("/:id", (req, res) => {
  const db = readDB();
  const idx = db.teachers.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Teacher not found" });

  const allowedFields = [
    "name",
    "photo",
    "images",
    "subjects",
    "classes",
    "qualifications",
    "experienceYears",
    "location",
    "address",
    "contact",
    "fees",
    "batchSize",
    "availableSeats",
    "description",
    "batchTimings",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      db.teachers[idx][field] = req.body[field];
    }
  });

  writeDB(db);
  res.json({ teacher: db.teachers[idx] });
});

module.exports = router;
