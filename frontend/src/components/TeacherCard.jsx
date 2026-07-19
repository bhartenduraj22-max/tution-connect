import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating.jsx";

export default function TeacherCard({ teacher }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={teacher.photo}
          alt={teacher.name}
          className="w-14 h-14 rounded-full object-cover border border-gray-200"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
          <p className="text-sm text-gray-500">{teacher.location}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {teacher.subjects.map((s) => (
          <span key={s} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
            {s}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>Classes: {teacher.classes.join(", ") || "—"}</p>
        <p>Experience: {teacher.experienceYears} yrs</p>
        <p>Fees: ₹{teacher.fees}/month</p>
        <p className={teacher.availableSeats > 0 ? "text-green-600" : "text-red-500"}>
          {teacher.availableSeats > 0 ? `${teacher.availableSeats} seats available` : "Batch full"}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
        <StarRating rating={teacher.rating} />
        <Link
          to={`/teachers/${teacher.id}`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}
