import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-brand-700 text-lg">
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">TC</span>
          Tuition Connect
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/teachers" className="hover:text-brand-600 font-medium">
            Find Teachers
          </Link>

          {!user && (
            <>
              <Link to="/login" className="hover:text-brand-600 font-medium">Login</Link>
              <Link
                to="/register"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}

          {user && user.role === "student" && (
            <Link to="/student/dashboard" className="hover:text-brand-600 font-medium">
              Dashboard
            </Link>
          )}
          {user && user.role === "teacher" && (
            <Link to="/teacher/dashboard" className="hover:text-brand-600 font-medium">
              Dashboard
            </Link>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-gray-500">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
