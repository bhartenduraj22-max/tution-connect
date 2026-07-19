import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BrowseTeachers from "./pages/BrowseTeachers.jsx";
import TeacherProfile from "./pages/TeacherProfile.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import AppointmentConfirmation from "./pages/AppointmentConfirmation.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teachers" element={<BrowseTeachers />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          <Route path="/book/:teacherId" element={<BookAppointment />} />
          <Route path="/appointment-confirmation/:id" element={<AppointmentConfirmation />} />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100">
        Tuition Connect — a bridge between students and offline tuition teachers.
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-24 text-gray-500">
      <h1 className="text-2xl font-bold mb-2">404</h1>
      <p>Page not found.</p>
    </div>
  );
}
