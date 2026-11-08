import React, { useState } from "react";

export default function PhotoPickerScreen({
  language,
  photos,
  frame,
  filter,
  onConfirmSelection,
  onRetake,
}) {
  const isMn = language === "MN";
  const requiredCount = frame.photoCount || 4; // e.g. 4 cuts out of 8 taken photos

  // Array of selected photo indices corresponding to each slot in the frame
  const [selectedIndices, setSelectedIndices] = useState([]);

  function togglePhoto(index) {
    if (selectedIndices.includes(index)) {
      // Remove from selection
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      // Add to selection if not yet full
      if (selectedIndices.length < requiredCount) {
        setSelectedIndices([...selectedIndices, index]);
      }
    }
  }

  function handleAutoFill() {
    // Pick the first N photos automatically
    const firstN = Array.from({ length: requiredCount }, (_, i) => i % photos.length);
    setSelectedIndices(firstN);
  }

  const isFull = selectedIndices.length === requiredCount;

  return (
    <div className="step-screen photo-picker-screen screen-enter">
      <div className="picker-header">
        <div>
          <span className="step-number-badge">CHOOSE {requiredCount} OF {photos.length}</span>
          <h1 className="step-title">
            {isMn
              ? `Зургаа сонгоно уу (${selectedIndices.length}/${requiredCount})`
              : `Select Your Photos (${selectedIndices.length}/${requiredCount})`}
          </h1>
          <p className="step-desc">
            {isMn
              ? `Авсан 8 зургаас дуртай ${requiredCount} зургийг дарж жаазны нүхэнд байршуулна уу`
              : `Tap any of the ${photos.length} shots on the left to fill your ${requiredCount}-cut strip`}
          </p>
        </div>

        <div className="picker-header-actions">
          <button type="button" className="quick-fill-btn" onClick={handleAutoFill}>
            ⚡ {isMn ? "Автоматаар сонгох" : "Auto Fill"}
          </button>
        </div>
      </div>

      {/* Main layout matching photo 4: Left grid of 8 shots with 0/4 counter, Right strip preview */}
      <div className="picker-stage-grid">
        {/* Left Side: 8 Captured Photos with Counter Box */}
        <div className="captured-pool-grid">
          {photos.map((photoSrc, idx) => {
            const isSelected = selectedIndices.includes(idx);
            const selectionOrder = selectedIndices.indexOf(idx) + 1;

            return (
              <button
                key={idx}
                type="button"
                className={`pool-photo-tile ${isSelected ? "selected" : ""}`}
                onClick={() => togglePhoto(idx)}
              >
                <img
                  src={photoSrc}
                  alt={`Shot ${idx + 1}`}
                  className="pool-img"
                  style={{ filter: filter?.css || "none" }}
                />
                <span className="pool-tile-number">#{idx + 1}</span>

                {isSelected && (
                  <div className="pool-selected-badge">
                    <span>{selectionOrder}</span>
                  </div>
                )}
              </button>
            );
          })}

          {/* Large Counter Tile matching the bottom tile in user photo 4 */}
          <div className="pool-counter-tile">
            <span className="counter-fraction">
              {selectedIndices.length}/{requiredCount}
            </span>
            <span className="counter-caption">
              {isFull
                ? (isMn ? "СОНГОГДСОН ✓" : "READY ✓")
                : (isMn ? "СОНГОХ ДУТУУ" : "SELECTING")}
            </span>
          </div>
        </div>

        {/* Right Side: The blank frame slots being filled */}
        <div className="picker-strip-target-side">
          <div className="target-strip-card">
            <div className="target-strip-topline">
              <span>{frame.cutLabel}</span>
              <span>PHOTO BOOTH</span>
            </div>

            <div
              className={`target-slots-layout layout-${frame.id}`}
              style={{
                gridTemplateColumns: `repeat(${frame.columns}, 1fr)`,
                gridTemplateRows: `repeat(${frame.rows}, 1fr)`,
              }}
            >
              {Array.from({ length: requiredCount }).map((_, slotIdx) => {
                const photoIndex = selectedIndices[slotIdx];
                const hasPhoto = photoIndex !== undefined;

                return (
                  <div
                    key={slotIdx}
                    className={`target-slot ${hasPhoto ? "filled" : "empty"}`}
                    onClick={() => {
                      if (hasPhoto) {
                        // Deselect this slot
                        setSelectedIndices(selectedIndices.filter((_, i) => i !== slotIdx));
                      }
                    }}
                  >
                    {hasPhoto ? (
                      <div className="slot-img-wrap">
                        <img
                          src={photos[photoIndex]}
                          alt={`Slot ${slotIdx + 1}`}
                          className="slot-img"
                          style={{ filter: filter?.css || "none" }}
                        />
                        <span className="slot-remove-pill">✕</span>
                      </div>
                    ) : (
                      <div className="slot-placeholder">
                        <span className="slot-plus">+</span>
                        <span className="slot-label">
                          {isMn ? `Зураг ${slotIdx + 1}` : `Cut ${slotIdx + 1}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="target-strip-footer">
              <span>PHOTO BOOTH STUDIO</span>
              <small>{new Date().toLocaleDateString("en-US")}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="step-bottom-bar single-action-bar">
        <div className="picker-prompt-note">
          {isMn ? "Зөвхөн 1 удаагийн зураг авалт · Дуртай зургаа сонгоно уу" : "Single session complete · Choose your favorites"}
        </div>
        <button
          type="button"
          className="nav-btn btn-primary"
          disabled={!isFull}
          onClick={() => {
            const chosen = selectedIndices.map((i) => photos[i]);
            onConfirmSelection(chosen);
          }}
        >
          {isMn ? "Хэвлэлт рүү шилжих" : "Proceed to Print"} →
        </button>
      </div>
    </div>
  );
}
