import React from "react";

export default function FilterBar({ filters, setFilters, options }) {
  const update = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));

  const reset = () =>
    setFilters({
      q: "",
      subject: "",
      location: "",
      class: "",
      maxFees: "",
      minExperience: "",
      minRating: "",
    });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search by name, subject, location..."
          value={filters.q}
          onChange={(e) => update("q", e.target.value)}
          className="col-span-1 sm:col-span-2 lg:col-span-4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <select
          value={filters.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Subjects</option>
          {options.subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Locations</option>
          {options.locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select
          value={filters.class}
          onChange={(e) => update("class", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Classes</option>
          {options.classes.map((c) => (
            <option key={c} value={c}>Class {c}</option>
          ))}
        </select>

        <select
          value={filters.minRating}
          onChange={(e) => update("minRating", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Any Rating</option>
          <option value="4">4★ & above</option>
          <option value="4.5">4.5★ & above</option>
        </select>

        <input
          type="number"
          placeholder="Max fees (₹)"
          value={filters.maxFees}
          onChange={(e) => update("maxFees", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="number"
          placeholder="Min experience (yrs)"
          value={filters.minExperience}
          onChange={(e) => update("minExperience", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={reset}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
