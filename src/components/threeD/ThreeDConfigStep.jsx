import React from "react";
import { threeDScales, threeDMaterials, threeDBases } from "../../data/threeDProducts";

export default function ThreeDConfigStep({
  language,
  selectedScale,
  onSelectScale,
  selectedMaterial,
  onSelectMaterial,
  selectedBase,
  onSelectBase,
  onNext,
  onBack,
}) {
  const isMn = language === "MN";

  return (
    <div className="step-screen three-d-config-screen screen-enter">
      <div className="step-header">
        <div className="step-number-badge highlight-green">3D CONFIGURATION · STEP 01</div>
        <h1 className="step-title">
          {isMn ? "3D Баримлын хэмжээ & Материал сонгох" : "Configure Your 3D Figurine"}
        </h1>
        <p className="step-desc">
          {isMn
            ? "Хэвлүүлэх баримлын хэмжээ, материал болон суурийн загвараа сонгоно уу"
            : "Select your desired 3D print scale, full-color material, and display base"}
        </p>
      </div>

      <div className="three-d-config-grid">
        {/* 1. Scale Selection */}
        <div className="config-section-card">
          <h3 className="config-section-title">
            <span className="step-dot">1</span>
            {isMn ? "БАРИМЛЫН ӨНДӨР / ХЭМЖЭЭ" : "FIGURINE SCALE & SIZE"}
          </h3>
          <div className="scale-cards-list">
            {threeDScales.map((item) => {
              const active = selectedScale.id === item.id;
              const priceText = isMn
                ? `${item.priceMNT.toLocaleString()}₮`
                : `$${item.priceUSD}`;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`scale-option-btn ${active ? "active" : ""}`}
                  onClick={() => onSelectScale(item)}
                >
                  <div className="scale-badge-tag">{item.badge}</div>
                  <div className="scale-height-visual">
                    <span className="scale-cm-ruler">
                      {item.id === "mini-10" ? "10cm" : item.id === "standard-15" ? "15cm" : "20cm"}
                    </span>
                  </div>
                  <div className="scale-info-box">
                    <strong>{isMn ? item.mn : item.name}</strong>
                    <small>{isMn ? item.mnDesc : item.desc}</small>
                  </div>
                  <div className="scale-price-pill">{priceText}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Material & Color Finish */}
        <div className="config-section-card">
          <h3 className="config-section-title">
            <span className="step-dot">2</span>
            {isMn ? "3D ХЭВЛЭХ МАТЕРИАЛ" : "PRINT MATERIAL & TEXTURE"}
          </h3>
          <div className="material-options-list">
            {threeDMaterials.map((mat) => {
              const active = selectedMaterial.id === mat.id;
              return (
                <button
                  key={mat.id}
                  type="button"
                  className={`material-option-btn ${active ? "active" : ""}`}
                  onClick={() => onSelectMaterial(mat)}
                >
                  <div className="mat-sample-orb" style={{ background: mat.colorPreview }} />
                  <div className="mat-info-text">
                    <strong>{isMn ? mat.mn : mat.name}</strong>
                    <small>{isMn ? mat.mnDesc : mat.desc}</small>
                  </div>
                  <span className="mat-tag">{mat.tag}</span>
                  {active && <span className="mat-check">✓</span>}
                </button>
              );
            })}
          </div>

          {/* 3. Base Pedestal */}
          <h3 className="config-section-title mt-20">
            <span className="step-dot">3</span>
            {isMn ? "СУУРИЙН ЗАГВАР" : "PEDESTAL DISPLAY BASE"}
          </h3>
          <div className="base-options-row">
            {threeDBases.map((b) => {
              const active = selectedBase.id === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  className={`base-option-btn ${active ? "active" : ""}`}
                  onClick={() => onSelectBase(b)}
                >
                  <span className="base-icon">{b.icon}</span>
                  <strong>{isMn ? b.mn : b.name}</strong>
                  {active && <span className="base-check-mark">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="step-bottom-bar">
        <button type="button" className="nav-btn btn-secondary" onClick={onBack}>
          ← {isMn ? "Буцах" : "Back"}
        </button>
        <button type="button" className="nav-btn btn-primary btn-green" onClick={onNext}>
          {isMn ? "Скан заавар руу шилжих" : "Proceed to Posture Guide"} →
        </button>
      </div>
    </div>
  );
}
