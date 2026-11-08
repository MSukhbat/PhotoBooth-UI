import React, { useEffect, useRef, useState } from "react";
import { filters } from "../data/filters";

export default function FilterStep({ language, selectedFilter, onSelectFilter, onNext, onBack, mode }) {
  const isMn = language === "MN";
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (active) {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        } else {
          s.getTracks().forEach((t) => t.stop());
        }
      } catch (err) {
        console.warn("Camera preview not available in filter step", err);
      }
    }
    startCamera();
    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="step-screen filter-step screen-enter">
      <div className="step-header">
        <div className="step-number-badge">STEP 01 / 04</div>
        <h1 className="step-title">
          {isMn ? "Зургийн шүүлтүүр сонгох" : "Choose Your Photo Filter"}
        </h1>
        <p className="step-desc">
          {isMn
            ? "Өөрийн хэв маягт тохирох өнгөний шүүлтүүрийг сонгоно уу"
            : "Select a photo filter tone for your shoot"}
        </p>
      </div>

      <div className="filter-step-layout">
        <div className="filter-live-stage">
          <div className="filter-view-box">
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="filter-video"
                style={{ filter: selectedFilter.css }}
              />
            ) : (
              <div
                className="filter-placeholder-preview"
                style={{ filter: selectedFilter.css }}
              >
                <div className="filter-avatar-silhouette">
                  <span className="avatar-icon">👤</span>
                  <p>{isMn ? "Шүүлтүүрийн харагдац" : "Filter Tone Preview"}</p>
                </div>
              </div>
            )}
            <div className="filter-badge-overlay">
              <span className="dot" />
              <span>{isMn ? selectedFilter.mn : selectedFilter.name}</span>
            </div>
          </div>
        </div>

        <div className="filter-options-grid">
          {filters.map((f) => {
            const active = f.id === selectedFilter.id;
            return (
              <button
                key={f.id}
                type="button"
                className={`filter-card-btn ${active ? "active" : ""}`}
                onClick={() => onSelectFilter(f)}
              >
                <div className="filter-card-sample" style={{ background: f.sample }} />
                <div className="filter-card-info">
                  <span className="filter-card-title">{isMn ? f.mn : f.name}</span>
                  <span className="filter-card-sub">{isMn ? f.mnDesc : f.desc}</span>
                </div>
                {active && <span className="filter-check-mark">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="step-bottom-bar">
        <button type="button" className="nav-btn btn-secondary" onClick={onBack}>
          ← {isMn ? "Буцах" : "Back"}
        </button>
        <button type="button" className="nav-btn btn-primary" onClick={onNext}>
          {isMn ? "Дараах" : "Next"} →
        </button>
      </div>
    </div>
  );
}
