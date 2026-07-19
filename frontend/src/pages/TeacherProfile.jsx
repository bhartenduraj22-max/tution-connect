import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";
import StarRating from "../components/StarRating.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function TeacherProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favMessage, setFavMessage] = useState("");

  useEffect(() => {
    api.get(`/teachers/${id}`).then(({ data }) => {
      setTeacher(data.teacher);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (user && user.role === "student") {
      api.get(`/students/${user.id}/favorites`).then(({ data }) => {
        setIsFavorite(data.teachers.some((t) => t.id === id));
      });
    }
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user || user.role !== "student") return;
    setFavLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/students/${user.id}/favorites/${id}`);
        setIsFavorite(false);
        setFavMessage("Removed from favorites");
      } else {
        await api.post(`/students/${user.id}/favorites`, { teacherId: id });
        setIsFavorite(true);
        setFavMessage("Added to favorites");
      }
    } finally {
      setFavLoading(false);
      setTimeout(() => setFavMessage(""), 2000);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-gray-500">Loading profile...</div>;
  if (!teacher) return <div className="max-w-5xl mx-auto px-4 py-16 text-gray-500">Teacher not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img
            src={teacher.photo}
            alt={teacher.name}
            className="w-24 h-24 rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{teacher.name}</h1>
            <p className="text-gray-500">{teacher.qualifications}</p>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <StarRating rating={teacher.rating} />
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">{teacher.studentsTaught}+ students taught</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">{teacher.experienceYears} yrs experience</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Link
              to={`/book/${teacher.id}`}
              className="bg-brand-600 text-white text-center px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700"
            >
              Book a Visit
            </Link>
            {user && user.role === "student" && (
              <button
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`border px-5 py-2 rounded-lg text-sm font-medium ${
                  isFavorite
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {isFavorite ? "♥ Favorited" : "♡ Add to Favorites"}
              </button>
            )}
            {favMessage && <p className="text-xs text-center text-gray-500">{favMessage}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {teacher.description || "No description provided yet."}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3">Classroom & Achievements</h2>
            {teacher.images && teacher.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {teacher.images.map((img, i) => (
                  <img key={i} src={img} alt="classroom" className="rounded-lg h-28 w-full object-cover" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No images uploaded yet.</p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">
              Reviews ({teacher.reviews?.length || 0})
            </h2>
            <div className="space-y-4">
              {teacher.reviews && teacher.reviews.length > 0 ? (
                teacher.reviews.map((r) => (
                  <div key={r.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{r.studentName}</span>
                      <StarRating rating={r.rating} size="text-xs" />
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{r.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3 text-sm">
            <h2 className="font-semibold text-lg mb-1">Details</h2>
            <div className="flex justify-between">
              <span className="text-gray-500">Subjects</span>
              <span className="font-medium text-right">{teacher.subjects.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Classes</span>
              <span className="font-medium">{teacher.classes.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fees</span>
              <span className="font-medium">₹{teacher.fees}/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Batch Size</span>
              <span className="font-medium">{teacher.batchSize} students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Seats Available</span>
              <span className={`font-medium ${teacher.availableSeats > 0 ? "text-green-600" : "text-red-500"}`}>
                {teacher.availableSeats}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact</span>
              <span className="font-medium">{teacher.contact}</span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <span className="text-gray-500 block mb-1">Address</span>
              <span className="font-medium">{teacher.address}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm">
            <h2 className="font-semibold text-lg mb-3">Batch Timings</h2>
            <div className="space-y-2">
              {teacher.batchTimings && teacher.batchTimings.length > 0 ? (
                teacher.batchTimings.map((b, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-500">{b.label}</span>
                    <span className="font-medium">{b.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Not specified.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
