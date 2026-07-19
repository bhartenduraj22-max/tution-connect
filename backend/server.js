const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/teachers");
const appointmentRoutes = require("./routes/appointments");
const studentRoutes = require("./routes/students");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/students", studentRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.listen(PORT, () => {
  console.log(`Tuition Connect backend running on http://localhost:${PORT}`);
});
