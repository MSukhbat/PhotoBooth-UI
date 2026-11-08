import React, { useState } from "react";

export default function ThreeDResultScreen({
  language,
  photos, // The 8 multi-angle captures
  selectedScale,
  selectedMaterial,
  selectedBase,
  onProceedToOrder,
  onRestart,
}) {
  const isMn = language === "MN";
  const [activeAngle, setActiveAngle] = useState(0);
  const [viewMode, setViewMode] = useState("photo"); // "photo", "wireframe", "points"

  const angleNames = [
    { title: "FRONT (0°)", mn: "ЭГЦ УРД" },
    { title: "FRONT-LEFT (45°)", mn: "ЗҮҮН УРД" },
    { title: "LEFT PROFILE (90°)", mn: "ЗҮҮН ХАЖУУ" },
    { title: "BACK-LEFT (135°)", mn: "ЗҮҮН АР" },
    { title: "REAR (180°)", mn: "ЭГЦ АР" },
    { title: "BACK-RIGHT (225°)", mn: "БАРУУН АР" },
    { title: "RIGHT PROFILE (270°)", mn: "БАРУУН ХАЖУУ" },
    { title: "FRONT-RIGHT (315°)", mn: "БАРУУН УРД" },
  ];

  function rotateLeft() {
    setActiveAngle((prev) => (prev - 1 + 8) % 8);
  }

  function rotateRight() {
    setActiveAngle((prev) => (prev + 1) % 8);
  }

  return (
    <div className="step-screen three-d-result-screen screen-enter">
      <div className="three-d-header">
        <div className="step-number-badge highlight-green">
          {isMn ? "8-КАМЕР 360° СКАН АМЖИЛТТАЙ" : "8-CAMERA 360° MESH CALIBRATED"}
        </div>
        <h1 className="step-title">
          {isMn ? "3D Баримлын дижитал их бие бүртгэгдлээ" : "3D Digital Contour Reconstruction"}
        </h1>
        <p className="step-desc">
          {isMn
            ? "8 камерын өнцгүүдийг эргүүлж биеийн шугам болон 3D бүтцийг шалгана уу"
            : "Rotate the 360° turntable to inspect your reconstructed contours and wireframe mesh"}
        </p>
      </div>

      <div className="three-d-main-layout">
        {/* Interactive 360° Angle Inspector */}
        <div className="three-d-preview-column">
          <div className="three-d-viewport">
            <img
              src={photos[activeAngle] || photos[0]}
              alt="Active 3D Angle"
              className={`three-d-active-view ${viewMode === "wireframe" ? "wireframe-fx" : viewMode === "points" ? "points-fx" : ""}`}
            />

            {/* Wireframe Holographic Grid Overlay */}
            {viewMode === "wireframe" && <div className="hologram-scan-grid active" />}
            {viewMode === "points" && <div className="point-cloud-grid active" />}

            {/* View Mode Switcher: Real Photo / Wireframe Mesh / Point Cloud */}
            <div className="three-d-view-mode-tabs">
              <button
                type="button"
                className={`mode-tab-btn ${viewMode === "photo" ? "active" : ""}`}
                onClick={() => setViewMode("photo")}
              >
                📸 {isMn ? "Бодит зураг" : "Render"}
              </button>
              <button
                type="button"
                className={`mode-tab-btn ${viewMode === "wireframe" ? "active" : ""}`}
                onClick={() => setViewMode("wireframe")}
              >
                🌐 {isMn ? "3D Торлог" : "Wireframe"}
              </button>
              <button
                type="button"
                className={`mode-tab-btn ${viewMode === "points" ? "active" : ""}`}
                onClick={() => setViewMode("points")}
              >
                ✨ {isMn ? "Цэгэн үүл" : "Points"}
              </button>
            </div>

            <div className="three-d-angle-tag">
              <span className="dot pulse" />
              <span>
                {isMn
                  ? angleNames[activeAngle]?.mn
                  : angleNames[activeAngle]?.title}
              </span>
            </div>

            {/* Rotator Controls */}
            <div className="turntable-rotator-overlay">
              <button type="button" className="rotator-arrow-btn" onClick={rotateLeft} aria-label="Rotate Left">
                ◀
              </button>
              <span className="rotator-label">{isMn ? "360° ЭРГҮҮЛЭХ" : "ROTATE 360°"}</span>
              <button type="button" className="rotator-arrow-btn" onClick={rotateRight} aria-label="Rotate Right">
                ▶
              </button>
            </div>
          </div>

          {/* 8 Angle filmstrip */}
          <div className="angle-thumbnails-row">
            {photos.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`angle-thumb-btn ${activeAngle === i ? "active" : ""}`}
                onClick={() => setActiveAngle(i)}
              >
                <img src={img} alt={`Angle ${i + 1}`} />
                <span>CAM {i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Specs & Order Confirmation Side */}
        <div className="three-d-dispatch-column">
          <div className="database-card">
            <div className="db-card-header">
              <span className="db-icon">🖨️</span>
              <div>
                <h3>{isMn ? "3D Хэвлэгчийн Скан Мэдээлэл" : "3D Print Calibration Specs"}</h3>
                <span className="db-sync-status">● 8 CHANNELS SYNCHRONIZED</span>
              </div>
            </div>

            <div className="db-specs-list">
              <div className="db-spec-item">
                <span className="spec-label">{isMn ? "Сонгосон өндөр:" : "Figurine Scale:"}</span>
                <span className="spec-value highlight">{selectedScale?.name || "15cm (1:12 Scale)"}</span>
              </div>
              <div className="db-spec-item">
                <span className="spec-label">{isMn ? "Хэвлэх материал:" : "Material:"}</span>
                <span className="spec-value">{selectedMaterial?.name || "Full-Color UV Resin"}</span>
              </div>
              <div className="db-spec-item">
                <span className="spec-label">{isMn ? "Суурийн төрөл:" : "Pedestal Base:"}</span>
                <span className="spec-value">{selectedBase?.name || "Walnut Wood Base"}</span>
              </div>
              <div className="db-spec-item">
                <span className="spec-label">{isMn ? "3D Шугамын цэг:" : "Point Cloud Geometry:"}</span>
                <span className="spec-value highlight">48,290 Vertices / 96,580 Faces</span>
              </div>
              <div className="db-spec-item">
                <span className="spec-label">{isMn ? "Хэвлэх хугацаа:" : "Estimated Curing:"}</span>
                <span className="spec-value">{selectedScale?.printTimeHours || 24} Hours UV Precision</span>
              </div>
            </div>

            <div className="three-d-ready-action-box">
              <button
                type="button"
                className="btn-primary btn-green full-width-btn"
                onClick={onProceedToOrder}
              >
                <span className="icon">🚀</span>
                <span>{isMn ? "3D Хэвлэх Дараалалд Бүртгүүлэх" : "Proceed to 3D Print Queue"} →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="step-bottom-bar">
        <button type="button" className="nav-btn btn-secondary" onClick={onRestart}>
          {isMn ? "Шинээр эхлэх" : "Restart Session"}
        </button>
      </div>
    </div>
  );
}
