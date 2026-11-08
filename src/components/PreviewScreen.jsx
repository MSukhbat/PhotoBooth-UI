import React, { useState } from "react";
import FinalPreview from "./FinalPreview";
import { basicFrames, eventFrames } from "../data/backgrounds";
import { filters } from "../data/filters";

export default function PreviewScreen({
  language,
  photos,
  frame,
  filter,
  background,
  onFilterSelect,
  onBackgroundSelect,
  onRetake,
  onFinish,
}) {
  const isMn = language === "MN";

  // Category selection: "event" or "basic"
  const [frameType, setFrameType] = useState("event");
  const [eventIndex, setEventIndex] = useState(0);
  const [basicIndex, setBasicIndex] = useState(0);

  // Filter carousel index
  const currentFilterIndex = filters.findIndex((f) => f.id === filter.id);
  const activeFilterIdx = currentFilterIndex >= 0 ? currentFilterIndex : 0;

  // Navigate Event Frames
  function prevEvent() {
    const nextIdx = (eventIndex - 1 + eventFrames.length) % eventFrames.length;
    setEventIndex(nextIdx);
    setFrameType("event");
    onBackgroundSelect(eventFrames[nextIdx]);
  }
  function nextEvent() {
    const nextIdx = (eventIndex + 1) % eventFrames.length;
    setEventIndex(nextIdx);
    setFrameType("event");
    onBackgroundSelect(eventFrames[nextIdx]);
  }

  // Navigate Basic Frames
  function prevBasic() {
    const nextIdx = (basicIndex - 1 + basicFrames.length) % basicFrames.length;
    setBasicIndex(nextIdx);
    setFrameType("basic");
    onBackgroundSelect(basicFrames[nextIdx]);
  }
  function nextBasic() {
    const nextIdx = (basicIndex + 1) % basicFrames.length;
    setBasicIndex(nextIdx);
    setFrameType("basic");
    onBackgroundSelect(basicFrames[nextIdx]);
  }

  // Navigate Filters
  function prevFilter() {
    const nextIdx = (activeFilterIdx - 1 + filters.length) % filters.length;
    onFilterSelect(filters[nextIdx]);
  }
  function nextFilter() {
    const nextIdx = (activeFilterIdx + 1) % filters.length;
    onFilterSelect(filters[nextIdx]);
  }

  const currentEvent = eventFrames[eventIndex];
  const currentBasic = basicFrames[basicIndex];

  return (
    <div className="step-screen preview-screen screen-enter">
      <div className="preview-customizer-layout">
        {/* Left Side: Live Full Photobooth Strip Canvas */}
        <div className="preview-display-column">
          <FinalPreview
            photos={photos}
            frame={frame}
            background={background}
            filter={filter}
            language={language}
            onFinish={onFinish}
          />
        </div>

        {/* Right Side: Circular Carousel Controls Matching Uploaded Photo 5 */}
        <div className="kiosk-carousel-controls-side">
          <div className="carousel-control-card">
            {/* 1. Event Frame Section matching Photo 5 */}
            <div className={`frame-category-group ${frameType === "event" ? "active" : ""}`}>
              <button
                type="button"
                className="category-title-toggle"
                onClick={() => {
                  setFrameType("event");
                  onBackgroundSelect(currentEvent);
                }}
              >
                <span className="check-bubble">{frameType === "event" ? "✓" : "○"}</span>
                <span className="category-label">
                  {isMn ? "ТУСГАЙ ЖААЗ" : "EVENT FRAME"}
                </span>
              </button>

              <div className="carousel-nav-row">
                <button
                  type="button"
                  className="carousel-arrow-btn left"
                  onClick={prevEvent}
                  aria-label="Previous Event Frame"
                >
                  ◀
                </button>

                <div
                  className="carousel-circle-preview event-circle"
                  style={{ background: currentEvent.color, borderColor: currentEvent.border }}
                  onClick={() => {
                    setFrameType("event");
                    onBackgroundSelect(currentEvent);
                  }}
                >
                  <span className="event-badge-icon">{currentEvent.stickerBadge}</span>
                  <span className="event-title-badge">
                    {isMn ? currentEvent.mn : currentEvent.name}
                  </span>
                </div>

                <button
                  type="button"
                  className="carousel-arrow-btn right"
                  onClick={nextEvent}
                  aria-label="Next Event Frame"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* 2. Basic Solid Color Frame Section matching Photo 5 */}
            <div className={`frame-category-group ${frameType === "basic" ? "active" : ""}`}>
              <button
                type="button"
                className="category-title-toggle"
                onClick={() => {
                  setFrameType("basic");
                  onBackgroundSelect(currentBasic);
                }}
              >
                <span className="check-bubble">{frameType === "basic" ? "✓" : "○"}</span>
                <span className="category-label">
                  {isMn ? "ҮНДСЭН ӨНГИЙН ЖААЗ" : "BASIC COLOR FRAME"}
                </span>
              </button>

              <div className="carousel-nav-row">
                <button
                  type="button"
                  className="carousel-arrow-btn left"
                  onClick={prevBasic}
                  aria-label="Previous Color Frame"
                >
                  ◀
                </button>

                <div
                  className="carousel-circle-preview color-circle"
                  style={{ background: currentBasic.color, borderColor: currentBasic.border }}
                  onClick={() => {
                    setFrameType("basic");
                    onBackgroundSelect(currentBasic);
                  }}
                >
                  <span
                    className="basic-title-badge"
                    style={{ color: currentBasic.darkText ? "#222" : "#fff" }}
                  >
                    {isMn ? currentBasic.mn : currentBasic.name}
                  </span>
                </div>

                <button
                  type="button"
                  className="carousel-arrow-btn right"
                  onClick={nextBasic}
                  aria-label="Next Color Frame"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* 3. Photo Filter Section with Carousel Arrows */}
            <div className="frame-category-group filter-category-group">
              <div className="category-title-toggle filter-static-title">
                <span className="check-bubble">✦</span>
                <span className="category-label">
                  {isMn ? "ЗУРГИЙН ШҮҮЛТҮҮР" : "PHOTO FILTER"}
                </span>
              </div>

              <div className="carousel-nav-row">
                <button
                  type="button"
                  className="carousel-arrow-btn left"
                  onClick={prevFilter}
                  aria-label="Previous Filter"
                >
                  ◀
                </button>

                <div
                  className="carousel-circle-preview filter-circle"
                  style={{ background: filter.sample }}
                >
                  <span className="filter-badge-text">
                    {isMn ? filter.mn : filter.name}
                  </span>
                </div>

                <button
                  type="button"
                  className="carousel-arrow-btn right"
                  onClick={nextFilter}
                  aria-label="Next Filter"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Print & Proceed Button */}
            <div className="carousel-finish-action">
              <span className="session-guarantee-note">
                {isMn ? "✓ 1 удаагийн авсан зураг баталгаажсан" : "✓ Single session photo verified"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
