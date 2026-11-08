import React from "react";

export default function PhotoSelector({ photos, selectedIndex, onSelect, language, filter }) {
  return (
    <div className="photo-selector" aria-label={language === "MN" ? "Авсан зургууд" : "Captured photos"}>
      {photos.map((photo, index) => (
        <button
          type="button"
          key={`${index}-${photo.slice(-12)}`}
          className={`photo-thumb ${selectedIndex === index ? "selected" : ""}`}
          onClick={() => onSelect(index)}
          aria-label={`${language === "MN" ? "Зураг" : "Photo"} ${index + 1}`}
          aria-pressed={selectedIndex === index}
        >
          <img src={photo} alt="" style={{ filter }} />
          <span>{index + 1}</span>
        </button>
      ))}
    </div>
  );
}
