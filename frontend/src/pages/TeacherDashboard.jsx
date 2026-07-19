import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const TABS = ["Overview", "Profile", "Batches & Fees", "Appointments", "Today"];

const statusColors = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("Overview");
  const [teacher, setTeacher] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");
  const [form, setForm] = useState(null);

  const loadTeacher = () =>
    api.get(`/teachers/by-user/${user.id}`).then(({ data }) => {
      setTeacher(data.teacher);
      setForm(data.teacher);
    });

  const loadAppointments = (teacherId) =>
    api.get(`/appointments/teacher/${teacherId}`).then(({ data }) => setAppointments(data.appointments));

  useEffect(() => {
    loadTeacher().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (teacher) loadAppointments(teacher.id);
  }, [teacher?.id]);

  if (loading || !form) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-gray-500">Loading dashboard...</div>;
  }

  const saveProfile = async (fields) => {
    const { data } = await api.put(`/teachers/${teacher.id}`, fields);
    setTeacher(data.teacher);
    setForm(data.teacher);
    setSaveMsg("Saved successfully!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    loadAppointments(teacher.id);
  };

  const todaysAppointments = appointments.filter((a) => a.date === todayStr());
  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-1">Teacher Dashboard</h1>
      <p className="text-gray-500 mb-6">Manage your profile, batches and appointment requests.</p>

      <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              tab === t ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
            {t === "Appointments" && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Profile Views" value={teacher.profileViews} />
            <StatCard label="Total Appointments" value={teacher.totalAppointments} />
            <StatCard label="Total Students" value={teacher.studentsTaught} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="Average Rating" value={`${teacher.rating || 0} / 5`} small />
            <StatCard label="Available Seats" value={teacher.availableSeats} small />
          </div>
        </div>
      )}

      {tab === "Profile" && (
        <ProfileForm form={form} setForm={setForm} onSave={saveProfile} saveMsg={saveMsg} />
      )}

      {tab === "Batches & Fees" && (
        <BatchesForm form={form} setForm={setForm} onSave={saveProfile} saveMsg={saveMsg} />
      )}

      {tab === "Appointments" && (
        <div className="space-y-3">
          {appointments.length === 0 && <EmptyState text="No appointment requests yet." />}
          {appointments.map((a) => (
            <AppointmentRow key={a.id} appt={a} onUpdate={updateStatus} />
          ))}
        </div>
      )}

      {tab === "Today" && (
        <div className="space-y-3">
          {todaysAppointments.length === 0 && <EmptyState text="No appointments scheduled for today." />}
          {todaysAppointments.map((a) => (
            <AppointmentRow key={a.id} appt={a} onUpdate={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, small }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={small ? "text-xl font-bold" : "text-3xl font-bold"}>{value}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-xl">{text}</div>;
}

function AppointmentRow({ appt, onUpdate }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
      <div>
        <p className="font-semibold">{appt.studentName}</p>
        <p className="text-sm text-gray-500">
          {appt.date} at {appt.time} • ID: {appt.appointmentCode}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[appt.status]}`}>
          {appt.status}
        </span>
        {appt.status === "pending" && (
          <>
            <button
              onClick={() => onUpdate(appt.id, "confirmed")}
              className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700"
            >
              Confirm
            </button>
            <button
              onClick={() => onUpdate(appt.id, "cancelled")}
              className="text-xs border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              Decline
            </button>
          </>
        )}
        {appt.status === "confirmed" && (
          <button
            onClick={() => onUpdate(appt.id, "completed")}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
          >
            Mark Completed
          </button>
        )}
      </div>
    </div>
  );
}

function ProfileForm({ form, setForm, onSave, saveMsg }) {
  const [local, setLocal] = useState(form);
  const [subjectsInput, setSubjectsInput] = useState(form.subjects.join(", "));
  const [classesInput, setClassesInput] = useState(form.classes.join(", "));
  const [imagesInput, setImagesInput] = useState((form.images || []).join(", "));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...local,
      subjects: subjectsInput.split(",").map((s) => s.trim()).filter(Boolean),
      classes: classesInput.split(",").map((s) => s.trim()).filter(Boolean),
      images: imagesInput.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" value={local.name} onChange={(v) => setLocal({ ...local, name: v })} />
        <Field label="Photo URL" value={local.photo} onChange={(v) => setLocal({ ...local, photo: v })} />
        <Field
          label="Qualifications"
          value={local.qualifications}
          onChange={(v) => setLocal({ ...local, qualifications: v })}
        />
        <Field
          label="Years of Experience"
          type="number"
          value={local.experienceYears}
          onChange={(v) => setLocal({ ...local, experienceYears: Number(v) })}
        />
        <Field label="Location (area)" value={local.location} onChange={(v) => setLocal({ ...local, location: v })} />
        <Field label="Full Address" value={local.address} onChange={(v) => setLocal({ ...local, address: v })} />
        <Field label="Contact Number" value={local.contact} onChange={(v) => setLocal({ ...local, contact: v })} />
      </div>

      <Field
        label="Subjects Taught (comma separated)"
        value={subjectsInput}
        onChange={setSubjectsInput}
        placeholder="Mathematics, Physics"
      />
      <Field
        label="Classes / Grades (comma separated)"
        value={classesInput}
        onChange={setClassesInput}
        placeholder="9, 10, 11"
      />
      <Field
        label="Classroom / Achievement Image URLs (comma separated)"
        value={imagesInput}
        onChange={setImagesInput}
        placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
      />

      <div>
        <label className="block text-sm font-medium mb-1">Short Description</label>
        <textarea
          rows={4}
          value={local.description}
          onChange={(e) => setLocal({ ...local, description: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button type="submit" className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700">
        Save Profile
      </button>
      {saveMsg && <p className="text-sm text-green-600">{saveMsg}</p>}
    </form>
  );
}

function BatchesForm({ form, setForm, onSave, saveMsg }) {
  const [local, setLocal] = useState(form);
  const [timings, setTimings] = useState(form.batchTimings.length ? form.batchTimings : [{ label: "", time: "" }]);

  const updateTiming = (i, field, value) => {
    const copy = [...timings];
    copy[i][field] = value;
    setTimings(copy);
  };
  const addTiming = () => setTimings([...timings, { label: "", time: "" }]);
  const removeTiming = (i) => setTimings(timings.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...local,
      batchTimings: timings.filter((t) => t.label && t.time),
    });
  };

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label="Monthly Fees (₹)"
          type="number"
          value={local.fees}
          onChange={(v) => setLocal({ ...local, fees: Number(v) })}
        />
        <Field
          label="Students per Batch"
          type="number"
          value={local.batchSize}
          onChange={(v) => setLocal({ ...local, batchSize: Number(v) })}
        />
        <Field
          label="Available Seats"
          type="number"
          value={local.availableSeats}
          onChange={(v) => setLocal({ ...local, availableSeats: Number(v) })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Batch Timings</label>
        <div className="space-y-2">
          {timings.map((t, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Batch name (e.g. Morning Batch)"
                value={t.label}
                onChange={(e) => updateTiming(i, "label", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                placeholder="Timing (e.g. 5:00 PM - 6:30 PM)"
                value={t.time}
                onChange={(e) => updateTiming(i, "time", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeTiming(i)}
                className="text-red-500 text-sm px-2 hover:bg-red-50 rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTiming}
          className="text-sm text-brand-600 font-medium mt-2 hover:underline"
        >
          + Add another batch timing
        </button>
      </div>

      <button type="submit" className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700">
        Save Batch Details
      </button>
      {saveMsg && <p className="text-sm text-green-600">{saveMsg}</p>}
    </form>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
