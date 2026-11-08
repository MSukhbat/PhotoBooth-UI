import React from "react";

export default function ThreeDPoseGuideStep({
  language,
  selectedScale,
  onNext,
  onBack,
}) {
  const isMn = language === "MN";

  return (
    <div className="step-screen three-d-guide-screen screen-enter">
      <div className="step-header">
        <div className="step-number-badge highlight-green">3D CALIBRATION · STEP 02</div>
        <h1 className="step-title">
          {isMn ? "3D Скан байрлал & Камерын заавар" : "Posture & 8-Camera Calibration"}
        </h1>
        <p className="step-desc">
          {isMn
            ? "8 камер таны бүх өнцгийг алдаагүй бүртгэхийн тулд дараах зааврыг баримтална уу"
            : "Follow the posture calibration guide for perfect 360° figurine contour capture"}
        </p>
      </div>

      <div className="three-d-guide-layout">
        {/* Turntable 360° Visual Representation */}
        <div className="turntable-visual-card">
          <div className="turntable-360-stage">
            <div className="turntable-floor-ring">
              <div className="turntable-center-footprints">
                <span className="footprint left">👣</span>
              </div>
              {/* 8 Camera Perimeter Nodes */}
              {Array.from({ length: 8 }).map((_, i) => {
                const deg = i * 45;
                const rad = (deg - 90) * (Math.PI / 180);
                const x = 50 + 44 * Math.cos(rad);
                const y = 50 + 44 * Math.sin(rad);

                return (
                  <div
                    key={i}
                    className="camera-perimeter-node"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    title={`CAM ${i + 1} (${deg}°)`}
                  >
                    <span className="cam-node-icon">📷</span>
                    <span className="cam-node-label">0{i + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="laser-beam-ring" />
          </div>

          <div className="turntable-caption-badge">
            <span className="pulse-dot green" />
            <span>{isMn ? "8 КАМЕРЫН БАЙРШИЛ ШАЛГАГДСАН" : "8 SYNC CAMERAS CALIBRATED"}</span>
          </div>
        </div>

        {/* Posture checklist cards */}
        <div className="posture-rules-column">
          <div className="posture-rule-card">
            <span className="rule-num">01</span>
            <div className="rule-content">
              <strong>{isMn ? "Шалны дугуй тэмдэглэгээ дээр зогсох" : "Stand On Center Floor Ring"}</strong>
              <p>
                {isMn
                  ? "Киоскын шалан дээрх гэрэлтсэн дугуйн яг голд эгц зогсоно уу"
                  : "Step directly onto the illuminated circular center marker"}
              </p>
            </div>
          </div>

          <div className="posture-rule-card">
            <span className="rule-num">02</span>
            <div className="rule-content">
              <strong>{isMn ? "Гараа биеэс үл ялиг холдуулах" : "Keep Arms Slightly Away From Torso"}</strong>
              <p>
                {isMn
                  ? "Хувцас болон биеийн бүтцийг нарийн ялгахын тулд гараа А-хэлбэрээр бага зэрэг дэлгэнэ"
                  : "Hold arms slightly separated from your torso for clean 3D body separation"}
              </p>
            </div>
          </div>

          <div className="posture-rule-card">
            <span className="rule-num">03</span>
            <div className="rule-content">
              <strong>{isMn ? "Камер 1 (Эгц урд) рүү эгц харах" : "Look Directly At Camera 01 (Front)"}</strong>
              <p>
                {isMn
                  ? "Нүүрний инээмсэглэл, харцаа урд талын 1-р камер руу чиглүүлнэ"
                  : "Fix your gaze at the front center lens for accurate facial geometry"}
              </p>
            </div>
          </div>

          <div className="posture-rule-card highlight-card">
            <span className="rule-num">⏱️</span>
            <div className="rule-content">
              <strong>{isMn ? "3 секундийн турш хөдөлгөөнгүй барих" : "Hold Still For 3 Seconds"}</strong>
              <p>
                {isMn
                  ? "Скан эхлэх дохио дуугарах үед хөдөлгөөнгүй зогсоход 8 камер зэрэг зургийг авна"
                  : "Hold your pose completely still when the countdown chimes for 360° capture"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="step-bottom-bar">
        <button type="button" className="nav-btn btn-secondary" onClick={onBack}>
          ← {isMn ? "Буцах" : "Back"}
        </button>
        <button type="button" className="nav-btn btn-primary btn-green" onClick={onNext}>
          {isMn ? "Төлбөр төлөх рүү шилжих" : "Proceed to Payment"} →
        </button>
      </div>
    </div>
  );
}
