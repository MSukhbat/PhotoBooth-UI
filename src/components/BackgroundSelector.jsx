import React from "react";
import { backgrounds } from "../data/backgrounds";

export default function BackgroundSelector({ selected, onSelect, language }) {
  const isMn = language === "MN";

  return (
    <div className="swatch-list" role="group" aria-label={isMn ? "Жаазны өнгө" : "Background color"}>
      {backgrounds.map((bg) => {
        const isSelected = selected.id === bg.id;
        return (
          <button
            key={bg.id}
            type="button"
            className={`swatch-button ${isSelected ? "selected" : ""}`}
            style={{
              backgroundColor: bg.color,
              borderColor: isSelected ? "var(--kiosk-pink)" : bg.border,
            }}
            onClick={() => onSelect(bg)}
            aria-label={isMn ? bg.mn : bg.name}
            title={isMn ? bg.mn : bg.name}
          >
            {isSelected && (
              <span style={{ color: bg.darkText ? "#222" : "#fff" }}>✓</span>
            )}
            <span className="swatch-name">{isMn ? bg.mn : bg.name}</span>
          </button>
        );
      })}
    </div>
  );
}
