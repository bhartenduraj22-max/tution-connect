import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function BookAppointment() {
  const { teacherId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/teachers/${teacherId}`).then(({ data }) => setTeacher(data.teacher));
  }, [teacherId]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center bg-white border border-gray-200 rounded-xl p-8">
        <p className="text-gray-600 mb-4">Please login as a student to book an appointment.</p>
        <Link to="/login" className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700">
          Login
        </Link>
      </div>
    );
  }

  if (user.role !== "student") {
    return (
      <div className="max-w-md mx-auto mt-16 text-center bg-white border border-gray-200 rounded-xl p-8 text-gray-600">
        Only students can book appointments.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      setError("Please select both a date and time");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/appointments", {
        studentId: user.id,
        studentName: user.name,
        teacherId,
        date,
        time,
      });
      navigate(`/appointment-confirmation/${data.appointment.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">Book a Visit</h1>
      <p className="text-gray-500 mb-6">Schedule a free visit to the coaching center before joining.</p>

      {teacher && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <img src={teacher.photo} className="w-12 h-12 rounded-full object-cover" alt={teacher.name} />
          <div>
            <p className="font-semibold">{teacher.name}</p>
            <p className="text-sm text-gray-500">{teacher.subjects.join(", ")} • {teacher.location}</p>
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Time</label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
        <p className="text-xs text-gray-400 text-center">
          This only books a visit to the center — no payment or admission is involved.
        </p>
      </form>
    </div>
  );
}
