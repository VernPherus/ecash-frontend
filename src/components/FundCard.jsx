import React from "react";
import { formatCurrency } from "../lib/formatters";
import { useNavigate } from "react-router-dom";

const FundCard = ({ id, code, remaining, name }) => {
  const navigate = useNavigate();
  return (
    <div
      key={id}
      onClick={() => navigate(`/funds/${id}`)}
      className="group bg-base-100 hover:bg-base-50 border border-base-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center"
    >
      {/* 1. Badge (Pill) */}
      <span
        className={`badge ${badgeClass} badge-sm border-none text-white font-bold shadow-sm mb-3`}
      >
        {code}
      </span>

      {/* 2. Big Amount */}
      <h3
        className={`text-2xl font-bold tracking-tight mb-1 ${
          isCritical ? "text-error" : "text-base-content"
        }`}
      >
        {formatCurrency(remaining)}
      </h3>

      {/* 3. Name (Subtle) */}
      <p className="text-xs text-base-content/50 font-medium truncate max-w-full px-2">
        {name}
      </p>
    </div>
  );
};

export default FundCard;
 