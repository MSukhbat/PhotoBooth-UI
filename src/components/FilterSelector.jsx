import React from "react";
import { filters } from "../data/filters";

export default function FilterSelector({ selected, onSelect, language }) {
  const isMn = language === "MN";

  return (
    <div className="filter-list" role="group" aria-label={isMn ? "Зургийн шүүлтүүр" : "Photo filter"}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`filter-button ${selected.id === filter.id ? "selected" : ""}`}
          onClick={() => onSelect(filter)}
          aria-pressed={selected.id === filter.id}
        >
          <span className="filter-sample" style={{ background: filter.sample }} aria-hidden="true" />
          {isMn ? filter.mn : filter.name}
        </button>
      ))}
    </div>
  );
}
