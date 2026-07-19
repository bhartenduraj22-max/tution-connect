import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";

export default function AppointmentConfirmation() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/appointments/${id}`).then(({ data }) => {
      setAppointment(data.appointment);
      setTeacher(data.teacher);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="max-w-lg mx-auto px-4 py-16 text-gray-500">Loading...</div>;
  if (!appointment) return <div className="max-w-lg mx-auto px-4 py-16 text-gray-500">Appointment not found.</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 text-2xl flex items-center justify-center mx-auto mb-4">
          ✓
        </div>
        <h1 className="text-xl font-bold mb-1">Appointment Booked!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your visit has been requested. The teacher will confirm it shortly.
        </p>

        <div className="text-left bg-gray-50 rounded-lg p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Appointment ID</span>
            <span className="font-mono font-semibold">{appointment.appointmentCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="capitalize font-medium text-amber-600">{appointment.status}</span>
          </div>
          {teacher && (
            <div className="flex justify-between">
              <span className="text-gray-500">Teacher</span>
              <span className="font-medium">{teacher.name}</span>
            </div>
          )}
          {teacher && (
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-medium">{teacher.location}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{appointment.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium">{appointment.time}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/student/dashboard"
            className="flex-1 bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/teachers"
            className="flex-1 border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-50"
          >
            Browse More
          </Link>
        </div>
      </div>
    </div>
  );
}
