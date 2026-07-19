import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user);
      navigate(data.user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "student") setForm({ email: "aarav@student.com", password: "student123" });
    else setForm({ email: "anita@teacher.com", password: "teacher123" });
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-gray-200 rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-gray-500 text-sm mb-6">Login to your Tuition Connect account</p>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 flex gap-2 text-xs">
        <button onClick={() => fillDemo("student")} className="flex-1 border border-gray-200 rounded-lg py-2 hover:bg-gray-50">
          Use demo student
        </button>
        <button onClick={() => fillDemo("teacher")} className="flex-1 border border-gray-200 rounded-lg py-2 hover:bg-gray-50">
          Use demo teacher
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-6 text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand-600 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
