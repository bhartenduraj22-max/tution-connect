import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StarRating from "../components/StarRating.jsx";

const TABS = ["Upcoming", "History", "Favorites", "Profile"];

const statusColors = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

export default function StudentDashboard() {
  const { user, login } = useAuth();
  const [tab, setTab] = useState("Upcoming");
  const [appointments, setAppointments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone || "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const loadAppointments = () =>
    api.get(`/appointments/student/${user.id}`).then(({ data }) => setAppointments(data.appointments));

  const loadFavorites = () =>
    api.get(`/students/${user.id}/favorites`).then(({ data }) => setFavorites(data.teachers));

  useEffect(() => {
    loadAppointments();
    loadFavorites();
  }, []);

  const upcoming = appointments.filter((a) => ["pending", "confirmed"].includes(a.status));
  const history = appointments.filter((a) => ["completed", "cancelled"].includes(a.status));

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put(`/students/${user.id}`, profile);
      login({ ...user, ...data.student });
      setSavedMsg("Profile updated!");
      setTimeout(() => setSavedMsg(""), 2000);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-1">Student Dashboard</h1>
      <p className="text-gray-500 mb-6">Manage your appointments, favorites and profile.</p>

      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Upcoming" && (
        <div className="space-y-3">
          {upcoming.length === 0 && <EmptyState text="No upcoming appointments yet." />}
          {upcoming.map((a) => (
            <AppointmentRow key={a.id} appt={a} />
          ))}
        </div>
      )}

      {tab === "History" && (
        <div className="space-y-3">
          {history.length === 0 && <EmptyState text="No past appointments yet." />}
          {history.map((a) => (
            <AppointmentRow key={a.id} appt={a} />
          ))}
        </div>
      )}

      {tab === "Favorites" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.length === 0 && <EmptyState text="You haven't favorited any teachers yet." />}
          {favorites.map((t) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <img src={t.photo} className="w-12 h-12 rounded-full object-cover" alt={t.name} />
              <div className="flex-1">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.subjects.join(", ")}</p>
                <StarRating rating={t.rating} size="text-xs" />
              </div>
              <Link to={`/teachers/${t.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                View
              </Link>
            </div>
          ))}
        </div>
      )}

      {tab === "Profile" && (
        <form onSubmit={saveProfile} className="bg-white border border-gray-200 rounded-xl p-6 max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email (fixed)</label>
            <input disabled value={user.email} className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
          {savedMsg && <p className="text-sm text-green-600">{savedMsg}</p>}
        </form>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-xl">{text}</div>
  );
}

function AppointmentRow({ appt }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-2">
      <div>
        <p className="font-semibold">{appt.teacherName}</p>
        <p className="text-sm text-gray-500">
          {appt.date} at {appt.time} • ID: {appt.appointmentCode}
        </p>
      </div>
      <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[appt.status]}`}>
        {appt.status}
      </span>
    </div>
  );
}
