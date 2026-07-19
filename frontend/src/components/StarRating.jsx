import React from "react";

export default function StarRating({ rating = 0, size = "text-sm" }) {
  const full = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
      <span className="ml-1 text-gray-500">{rating ? rating.toFixed(1) : "New"}</span>
    </span>
  );
}
