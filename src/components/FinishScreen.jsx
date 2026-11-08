import React, { useEffect, useState } from "react";
import { kioskAudio } from "../utils/kioskAudio";

export default function FinishScreen({
  language,
  onRestart,
  sessionVideoUrl,
  photos,
}) {
  const isMn = language === "MN";
  const [activeTab, setActiveTab] = useState("qr"); // "qr" or "video"

  useEffect(() => {
    kioskAudio.playSuccess();
  }, []);

  function handleDownloadVideo() {
    if (!sessionVideoUrl) return;
    const link = document.createElement("a");
    link.href = sessionVideoUrl;
    link.download = `booth-bts-video-${Date.now()}.webm`;
    link.click();
  }

  return (
    <div className="finish-screen screen-enter">
      <div className="finish-icon-ring">♥</div>
      <span className="finish-badge">
        {isMn ? "ХЭВЛЭЛТ & БИЧЛЭГ БЭЛЭН БОЛЛОО" : "PRINTING & VIDEO READY"}
      </span>
      <h1 className="finish-main-title">
        {isMn ? "Дурсамж" : "Memories"}
        <br />
        <span className="accent-text">
          {isMn ? "бүтээгдлээ!" : "Captured Forever!"}
        </span>
      </h1>
      <p className="finish-desc">
        {isMn
          ? "Зургийн хуудас хэвлэгдэж байна. Мөн зураг авалтын бодит бичлэгийг утсандаа татаж аваарай!"
          : "Your photo strip is printing below. Scan the QR to download your photos & behind-the-scenes video!"}
      </p>

      {/* Tabs: QR Code vs Video Player */}
      <div className="finish-media-tabs">
        <button
          type="button"
          className={`tab-pill-btn ${activeTab === "qr" ? "active" : ""}`}
          onClick={() => setActiveTab("qr")}
        >
          📱 {isMn ? "Утсаар татах QR" : "Mobile QR Download"}
        </button>
        {sessionVideoUrl && (
          <button
            type="button"
            className={`tab-pill-btn ${activeTab === "video" ? "active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            🎬 {isMn ? "Зураг авалтын бичлэг" : "BTS Video Player"}
          </button>
        )}
      </div>

      {activeTab === "qr" ? (
        /* Digital Download QR Section matching authentic Korean photobooths */
        <div className="finish-digital-qr-box">
          <div className="finish-qr-graphic">
            <svg width="96" height="96" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="#ffffff" rx="8" />
              {/* QR Position Squares */}
              <rect x="8" y="8" width="28" height="28" fill="#121216" rx="4" />
              <rect x="13" y="13" width="18" height="18" fill="#ffffff" />
              <rect x="18" y="18" width="8" height="8" fill="#121216" />

              <rect x="64" y="8" width="28" height="28" fill="#121216" rx="4" />
              <rect x="69" y="13" width="18" height="18" fill="#ffffff" />
              <rect x="74" y="18" width="8" height="8" fill="#121216" />

              <rect x="8" y="64" width="28" height="28" fill="#121216" rx="4" />
              <rect x="13" y="69" width="18" height="18" fill="#ffffff" />
              <rect x="18" y="74" width="8" height="8" fill="#121216" />

              {/* Data matrix */}
              <rect x="42" y="10" width="6" height="6" fill="#121216" />
              <rect x="52" y="14" width="6" height="6" fill="#121216" />
              <rect x="42" y="24" width="6" height="6" fill="#121216" />
              <rect x="14" y="44" width="6" height="6" fill="#121216" />
              <rect x="24" y="48" width="6" height="6" fill="#121216" />
              <rect x="42" y="42" width="16" height="16" fill="#ff2a7a" rx="3" />
              <rect x="66" y="44" width="6" height="6" fill="#121216" />
              <rect x="76" y="48" width="6" height="6" fill="#121216" />
              <rect x="44" y="76" width="6" height="6" fill="#121216" />
              <rect x="56" y="80" width="6" height="6" fill="#121216" />
              <rect x="74" y="74" width="6" height="6" fill="#121216" />
              <rect x="84" y="84" width="6" height="6" fill="#121216" />
            </svg>
          </div>
          <div className="finish-qr-info">
            <strong>{isMn ? "УХААЛАГ УТСАНДАА ТАТАХ" : "SCAN FOR VIDEO & PHOTO"}</strong>
            <span>
              {isMn
                ? "Утасныхаа камераар QR кодыг уншуулан оригинал зураг болон зураг авалтын бичлэгийг үнэгүй татна уу"
                : "Point your phone camera at the QR code to save your high-res photos and video clip"}
            </span>
          </div>
        </div>
      ) : (
        /* Video Player Preview */
        <div className="finish-video-preview-wrapper">
          <div className="video-player-frame">
            <video
              src={sessionVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="finish-bts-video"
            />
            <div className="video-rec-tag">🔴 BEHIND THE SCENES</div>
          </div>
          <button
            type="button"
            className="download-video-btn"
            onClick={handleDownloadVideo}
          >
            📥 {isMn ? "Бичлэгийг компьютер/киоск дээр татах" : "Download Video Clip (.webm)"}
          </button>
        </div>
      )}

      {/* Simulated printer ejection slot */}
      <div className="finish-printer-slot-simulation">
        <div className="slot-opening">
          <div className="dispensed-paper-strip">
            <span className="paper-line" />
            <span className="paper-line" />
            <span className="paper-line" />
          </div>
        </div>
        <span className="slot-label">
          {isMn ? "↓ ЗУРАГ ГАРАХ ХЭСЭГ ↓" : "↓ COLLECT PRINTS HERE ↓"}
        </span>
      </div>

      <button className="nav-btn btn-primary finish-restart-btn" type="button" onClick={onRestart}>
        {isMn ? "Шинээр эхлүүлэх" : "Start New Session"} →
      </button>
    </div>
  );
}
