import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Find the right offline tuition teacher, <span className="text-brand-600">near you.</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Tuition Connect bridges students and local tuition teachers — compare subjects, fees,
          batch timings and ratings, then book a free visit before you join.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/teachers"
            className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700"
          >
            Browse Teachers
          </Link>
          {!user && (
            <Link
              to="/register"
              className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            title: "Search & Compare",
            desc: "Filter teachers by subject, class, location, fees and experience — all in one place.",
          },
          {
            title: "See Everything Upfront",
            desc: "Qualifications, batch timings, fees, seats available, ratings and real reviews.",
          },
          {
            title: "Book a Free Visit",
            desc: "Schedule a visit to the coaching center before deciding — no payment required.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Are you a tuition teacher?</h2>
          <p className="text-gray-500 mb-4">
            Create your free profile and reach more students in your area.
          </p>
          <Link
            to="/register"
            className="inline-block bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700"
          >
            Register as a Teacher
          </Link>
        </div>
      </section>
    </div>
  );
}
