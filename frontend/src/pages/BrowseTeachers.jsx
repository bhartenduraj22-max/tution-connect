import React, { useEffect, useState } from "react";
import api from "../api.js";
import TeacherCard from "../components/TeacherCard.jsx";
import FilterBar from "../components/FilterBar.jsx";

export default function BrowseTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [options, setOptions] = useState({ subjects: [], locations: [], classes: [] });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "",
    subject: "",
    location: "",
    class: "",
    maxFees: "",
    minExperience: "",
    minRating: "",
  });

  useEffect(() => {
    api.get("/teachers/meta/options").then(({ data }) => setOptions(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    const timer = setTimeout(() => {
      api
        .get("/teachers", { params })
        .then(({ data }) => setTeachers(data.teachers))
        .finally(() => setLoading(false));
    }, 250); // small debounce
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-1">Find Tuition Teachers</h1>
      <p className="text-gray-500 mb-6">Search and filter to find the best match for your child.</p>

      <FilterBar filters={filters} setFilters={setFilters} options={options} />

      {loading ? (
        <p className="text-gray-500">Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No teachers match your filters. Try adjusting your search.
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{teachers.length} teacher(s) found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map((t) => (
              <TeacherCard key={t.id} teacher={t} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
