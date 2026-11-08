import React, { useEffect, useRef, useState } from "react";
import { frames } from "../data/frames";

export default function CutSizeSelector({
  language,
  selectedFrame,
  onSelectFrame,
  onNext,
  onBack,
  filter,
}) {
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
        console.warn("Mirror background not available", err);
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
    <div className="step-screen cut-size-screen screen-enter">
      {/* Live mirror background like the Korean kiosk photo */}
      <div className="kiosk-mirror-bg">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="kiosk-mirror-video"
            style={{ filter: filter?.css || "none" }}
          />
        ) : (
          <div className="kiosk-mirror-fallback" />
        )}
        <div className="mirror-dark-tint" />
      </div>

      <div className="cut-size-header">
        <div className="step-number-badge">STEP 02 / 04</div>
        <h1 className="step-title">
          {isMn ? "Хэвлэх хэмжээ, загвар сонгох" : "Choose Cut Sizes"}
        </h1>
        <p className="step-desc">
          {isMn
            ? "Дэлгэцэн дээрх зураг авалтын загвараас хүссэн хэлбэрээ сонгоно уу"
            : "Tap your preferred photo strip cut and layout"}
        </p>
      </div>

      {/* Floating angled Korean photobooth card stage matching user photo 1 */}
      <div className="cut-size-stage">
        {frames.map((frame, idx) => {
          const isSelected = selectedFrame.id === frame.id;
          const priceText = isMn
            ? `${frame.priceMNT.toLocaleString()}₮`
            : `$${frame.priceUSD.toFixed(2)}`;

          return (
            <button
              key={frame.id}
              type="button"
              className={`cut-kiosk-item cut-pos-${idx} ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectFrame(frame)}
            >
              <span className="cut-type-tag">{frame.cutLabel}</span>

              <div className={`cut-strip-mockup ${frame.previewStyle}`}>
                {frame.id === "strip-4" && (
                  <div className="double-strip-wrapper">
                    <div className="strip-single strip-left">
                      <div className="mock-cell" />
                      <div className="mock-cell" />
                      <div className="mock-cell" />
                      <div className="mock-cell" />
                      <div className="mock-footer" />
                    </div>
                    <div className="strip-single strip-right">
                      <div className="mock-cell" />
                      <div className="mock-cell" />
                      <div className="mock-cell" />
                      <div className="mock-cell" />
                      <div className="mock-footer" />
                    </div>
                  </div>
                )}

                {frame.id === "grid-4" && (
                  <div className="grid-4-mockup">
                    <div className="mock-cell" />
                    <div className="mock-cell" />
                    <div className="mock-cell" />
                    <div className="mock-cell" />
                    <div className="mock-footer-wide" />
                  </div>
                )}

                {frame.id === "strip-6" && (
                  <div className="grid-6-mockup">
                    <div className="mock-cell" />
                    <div className="mock-cell" />
                    <div className="mock-cell" />
                    <div className="mock-cell" />
                    <div className="mock-cell" />
                    <div className="mock-cell" />
                    <div className="mock-footer-wide" />
                  </div>
                )}

                {frame.id === "wide-3" && (
                  <div className="wide-3-mockup">
                    <div className="mock-cell wide" />
                    <div className="mock-cell wide" />
                    <div className="mock-cell wide" />
                    <div className="mock-footer-wide" />
                  </div>
                )}
              </div>

              <div className="cut-price-pill">
                <span>{priceText}</span>
              </div>

              <div className="cut-title-info">
                <strong>{isMn ? frame.mn : frame.name}</strong>
                <small>{isMn ? frame.mnDescription : frame.description}</small>
              </div>

              {isSelected && <div className="cut-active-badge">✓</div>}
            </button>
          );
        })}
      </div>

      <div className="step-bottom-bar transparent-bar">
        <button type="button" className="nav-btn btn-secondary" onClick={onBack}>
          ← {isMn ? "Буцах" : "Back"}
        </button>
        <button type="button" className="nav-btn btn-primary" onClick={onNext}>
          {isMn ? "Үргэлжлүүлэх" : "Next"} →
        </button>
      </div>
    </div>
  );
}
