import React from "react";

export default function WelcomeScreen({ language, onSelectMode }) {
  const isMn = language === "MN";

  return (
    <div className="welcome-screen screen-enter">
      <div className="welcome-backdrop-glow" />

      <div className="welcome-hero">
        <span className="kiosk-badge">
          {isMn ? "ӨӨРТӨӨ ҮЙЛЧЛЭХ СТУДИ КИОСК" : "SELF-SERVICE STUDIO KIOSK"}
        </span>
        <h1 className="welcome-title">
          {isMn ? "МӨЧ БҮХНЭЭ" : "CAPTURE YOUR"}
          <br />
          <span className="accent-text">
            {isMn ? "ДАРЖ ҮЛДЭЭЕ" : "BEST MOMENTS"}
          </span>
        </h1>
        <p className="welcome-subtitle">
          {isMn
            ? "Дэлгэцэн дээр дарж үйлчилгээний төрлөө сонгоно уу"
            : "Select your desired booth mode to begin"}
        </p>
      </div>

      <div className="service-mode-cards">
        <button
          type="button"
          className="service-card mode-2d"
          onClick={() => onSelectMode("2d")}
        >
          <div className="service-card-tag">
            {isMn ? "ҮНДСЭН СОНГОЛТ" : "POPULAR"}
          </div>
          <div className="service-icon-box">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="service-card-content">
            <h2>{isMn ? "2D Фото зураг" : "2D Photo Strips"}</h2>
            <p>
              {isMn
                ? "Урд камераар 8 зураг автоматаар авч, хүссэн зургаа сонгон хэвлэх"
                : "Single front studio camera takes 8 shots. Pick your favorites & print instant strips."}
            </p>
          </div>
          <div className="service-card-action">
            <span>{isMn ? "ЭХЛЭХ" : "START"}</span>
            <span className="arrow">→</span>
          </div>
        </button>

        <button
          type="button"
          className="service-card mode-3d"
          onClick={() => onSelectMode("3d")}
        >
          <div className="service-card-tag highlight-tag">
            {isMn ? "8-КАМЕР 3D СИСТЕМ" : "8-CAMERA 3D SCAN"}
          </div>
          <div className="service-icon-box">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="service-card-content">
            <h2>{isMn ? "3D Дүрс / 3D Баримал" : "3D Figurine Scanner"}</h2>
            <p>
              {isMn
                ? "Киоскын 8 талын камераар хүний бүх биеийн шугамыг 360° авч, 3D хэвлэх хүсэлт office руу очино"
                : "8 synchronous multi-angle cameras capture all body lines for 3D model printing & database storage."}
            </p>
          </div>
          <div className="service-card-action">
            <span>{isMn ? "3D СКАН ЭХЛЭХ" : "START 3D SCAN"}</span>
            <span className="arrow">→</span>
          </div>
        </button>
      </div>

      <div className="welcome-footer-prompt">
        <span className="pulse-hand">👆</span>
        <span>
          {isMn
            ? "Дэлгэцэнд хүрч эхлүүлнэ үү"
            : "Touch anywhere on screen to continue"}
        </span>
      </div>
    </div>
  );
}
