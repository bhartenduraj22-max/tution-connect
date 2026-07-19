// Run with: node data/seed.js
// Generates db.json with dummy data for the Tuition Connect app.
const fs = require("fs");
const path = require("path");

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const teacherSeed = [
  {
    name: "Anita Sharma",
    subjects: ["Mathematics", "Physics"],
    classes: ["9", "10", "11", "12"],
    qualifications: "M.Sc. Mathematics, B.Ed.",
    experienceYears: 8,
    location: "Vijay Nagar, Indore",
    address: "12 Vijay Nagar Main Road, Indore",
    contact: "9876500001",
    fees: 2500,
    batchSize: 12,
    availableSeats: 3,
    description:
      "I focus on building strong fundamentals in Maths and Physics through daily practice sheets and weekly doubt sessions.",
    batchTimings: [
      { label: "Morning Batch", time: "7:00 AM - 8:30 AM" },
      { label: "Evening Batch", time: "5:00 PM - 6:30 PM" },
    ],
  },
  {
    name: "Rajesh Verma",
    subjects: ["Chemistry", "Biology"],
    classes: ["11", "12"],
    qualifications: "M.Sc. Chemistry, 5 yrs research experience",
    experienceYears: 10,
    location: "Rajwada, Indore",
    address: "45 Rajwada Chowk, Indore",
    contact: "9876500002",
    fees: 3000,
    batchSize: 15,
    availableSeats: 5,
    description:
      "NEET and board-focused coaching with regular mock tests and personal performance tracking for every student.",
    batchTimings: [
      { label: "Batch A", time: "6:30 AM - 8:00 AM" },
      { label: "Batch B", time: "4:00 PM - 5:30 PM" },
    ],
  },
  {
    name: "Priya Nair",
    subjects: ["English", "Social Science"],
    classes: ["6", "7", "8", "9", "10"],
    qualifications: "M.A. English Literature, B.Ed.",
    experienceYears: 6,
    location: "Palasia, Indore",
    address: "9 Palasia Square, Indore",
    contact: "9876500003",
    fees: 1800,
    batchSize: 10,
    availableSeats: 2,
    description:
      "I make grammar and writing simple with story-based learning and weekly speaking practice sessions.",
    batchTimings: [{ label: "Afternoon Batch", time: "3:00 PM - 4:30 PM" }],
  },
  {
    name: "Suresh Iyer",
    subjects: ["Computer Science", "Mathematics"],
    classes: ["11", "12"],
    qualifications: "B.Tech CSE, 4 yrs industry experience",
    experienceYears: 5,
    location: "Bhawarkuan, Indore",
    address: "22 Bhawarkuan Square, Indore",
    contact: "9876500004",
    fees: 2800,
    batchSize: 8,
    availableSeats: 0,
    description:
      "Hands-on coding classes covering Python, C++ and CS theory with project-based assignments every month.",
    batchTimings: [{ label: "Evening Batch", time: "6:00 PM - 7:30 PM" }],
  },
  {
    name: "Meena Joshi",
    subjects: ["Mathematics", "Science"],
    classes: ["6", "7", "8"],
    qualifications: "B.Sc., B.Ed.",
    experienceYears: 12,
    location: "Sudama Nagar, Indore",
    address: "3 Sudama Nagar, Indore",
    contact: "9876500005",
    fees: 1500,
    batchSize: 14,
    availableSeats: 4,
    description:
      "I specialize in helping middle school students clear basic concept gaps in Maths and Science before high school.",
    batchTimings: [{ label: "Morning Batch", time: "8:00 AM - 9:30 AM" }],
  },
  {
    name: "Karan Malhotra",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    classes: ["11", "12"],
    qualifications: "M.Tech, IIT Alumnus",
    experienceYears: 9,
    location: "Vijay Nagar, Indore",
    address: "18 Vijay Nagar Square, Indore",
    contact: "9876500006",
    fees: 3500,
    batchSize: 10,
    availableSeats: 1,
    description:
      "JEE-focused batches with a strong emphasis on problem solving speed and previous year paper analysis.",
    batchTimings: [
      { label: "Batch A", time: "6:00 AM - 7:30 AM" },
      { label: "Batch B", time: "7:00 PM - 8:30 PM" },
    ],
  },
  {
    name: "Sunita Deshmukh",
    subjects: ["Hindi", "Sanskrit"],
    classes: ["6", "7", "8", "9", "10"],
    qualifications: "M.A. Hindi Literature",
    experienceYears: 15,
    location: "Palasia, Indore",
    address: "27 Palasia, Indore",
    contact: "9876500007",
    fees: 1200,
    batchSize: 16,
    availableSeats: 6,
    description:
      "Experienced teacher focused on grammar, comprehension and exam writing techniques for board exams.",
    batchTimings: [{ label: "Afternoon Batch", time: "2:00 PM - 3:30 PM" }],
  },
  {
    name: "Vikram Rathore",
    subjects: ["Biology", "Chemistry"],
    classes: ["9", "10", "11", "12"],
    qualifications: "M.Sc. Zoology, B.Ed.",
    experienceYears: 7,
    location: "Bhawarkuan, Indore",
    address: "31 Bhawarkuan, Indore",
    contact: "9876500008",
    fees: 2200,
    batchSize: 12,
    availableSeats: 3,
    description:
      "I use diagrams, models and revision charts to make Biology and Chemistry easy to remember and score well.",
    batchTimings: [{ label: "Evening Batch", time: "5:30 PM - 7:00 PM" }],
  },
];

const reviewPool = [
  { studentName: "Aarav Patel", rating: 5, comment: "Explains concepts very clearly, my scores improved a lot." },
  { studentName: "Ishita Rao", rating: 4, comment: "Good teaching style, but batch is a bit crowded." },
  { studentName: "Rohan Gupta", rating: 5, comment: "Best teacher for doubt clearing, very patient." },
  { studentName: "Sneha Kulkarni", rating: 4, comment: "Well structured notes and regular tests." },
  { studentName: "Aditya Singh", rating: 5, comment: "Highly recommend, friendly and knowledgeable." },
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const teachers = teacherSeed.map((t, idx) => {
  const numReviews = randomBetween(2, 5);
  const reviews = Array.from({ length: numReviews }, () => {
    const r = reviewPool[randomBetween(0, reviewPool.length - 1)];
    return {
      id: uuid(),
      studentName: r.studentName,
      rating: r.rating,
      comment: r.comment,
      date: `2026-0${randomBetween(1, 6)}-${String(randomBetween(1, 28)).padStart(2, "0")}`,
    };
  });
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    id: uuid(),
    userId: `teacher-user-${idx + 1}`,
    photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}`,
    images: [
      `https://picsum.photos/seed/classroom${idx}1/400/300`,
      `https://picsum.photos/seed/classroom${idx}2/400/300`,
      `https://picsum.photos/seed/classroom${idx}3/400/300`,
    ],
    rating: Math.round(avgRating * 10) / 10,
    studentsTaught: randomBetween(40, 300),
    profileViews: randomBetween(100, 900),
    totalAppointments: randomBetween(10, 60),
    reviews,
    ...t,
  };
});

const users = [
  { id: "student-user-1", role: "student", name: "Aarav Patel", email: "aarav@student.com", password: "student123", phone: "9998887771" },
  { id: "student-user-2", role: "student", name: "Ishita Rao", email: "ishita@student.com", password: "student123", phone: "9998887772" },
];

teachers.forEach((t, idx) => {
  users.push({
    id: t.userId,
    role: "teacher",
    name: t.name,
    email: `${t.name.split(" ")[0].toLowerCase()}@teacher.com`,
    password: "teacher123",
    phone: t.contact,
    teacherProfileId: t.id,
  });
});

const appointments = [
  {
    id: uuid(),
    appointmentCode: "APT-100001",
    studentId: "student-user-1",
    studentName: "Aarav Patel",
    teacherId: teachers[0].id,
    teacherName: teachers[0].name,
    date: "2026-07-20",
    time: "5:00 PM",
    status: "confirmed",
    createdAt: "2026-07-15T10:00:00.000Z",
  },
  {
    id: uuid(),
    appointmentCode: "APT-100002",
    studentId: "student-user-1",
    studentName: "Aarav Patel",
    teacherId: teachers[2].id,
    teacherName: teachers[2].name,
    date: "2026-07-10",
    time: "3:00 PM",
    status: "completed",
    createdAt: "2026-07-05T09:00:00.000Z",
  },
  {
    id: uuid(),
    appointmentCode: "APT-100003",
    studentId: "student-user-2",
    studentName: "Ishita Rao",
    teacherId: teachers[0].id,
    teacherName: teachers[0].name,
    date: "2026-07-19",
    time: "7:00 AM",
    status: "pending",
    createdAt: "2026-07-16T11:00:00.000Z",
  },
];

const favorites = [
  { studentId: "student-user-1", teacherId: teachers[0].id },
  { studentId: "student-user-1", teacherId: teachers[5].id },
  { studentId: "student-user-2", teacherId: teachers[2].id },
];

const db = { users, teachers, appointments, favorites, nextAppointmentSeq: 100004 };

fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db, null, 2));
console.log("Seed data written to db.json");
