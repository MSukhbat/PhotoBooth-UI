import React, { useEffect, useRef, useState } from "react";
import BackgroundSelector from "./BackgroundSelector";
import FilterSelector from "./FilterSelector";
import { frames } from "../data/frames";

function FramePreview({ frame, stream, filter, active, background }) {
  const videoRefs = useRef([]);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean);
    videos.forEach((video) => {
      video.srcObject = stream;
      video.play().catch(() => {});
    });
    return () => videos.forEach((video) => {
      video.pause();
      video.srcObject = null;
    });
  }, [stream, frame.photoCount]);

  return (
    <div
      className={`frame-preview tone-${background.id} ${active ? "live-active" : ""}`}
      style={{ backgroundColor: background.color, "--frame-accent": frame.accent }}
    >
      <div className="frame-preview-cells" style={{ gridTemplateColumns: `repeat(${frame.columns}, 1fr)`, gridTemplateRows: `repeat(${frame.rows}, 1fr)` }}>
        {Array.from({ length: frame.photoCount }, (_, index) => {
          const sticker = frame.stickers[index % frame.stickers.length];
          return (
            <div className="frame-preview-photo" key={index} style={{ backgroundColor: background.color }}>
              {stream
                ? <video ref={(video) => { videoRefs.current[index] = video; }} className="frame-preview-video" autoPlay muted playsInline style={{ filter }} />
                : <div className="frame-preview-person"><span>☺</span></div>}
              <span className="frame-photo-number">{String(index + 1).padStart(2, "0")}</span>
              <span className={`photo-sticker photo-sticker-${index % 4}`} aria-hidden="true">{sticker}</span>
            </div>
          );
        })}
      </div>
      <div className="frame-preview-footer">인생네컷</div>
    </div>
  );
}

function useSelectionCamera() {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");
  const requestRef = useRef(0);
  const streamRef = useRef(null);

  async function connect() {
    const requestId = ++requestRef.current;
    setError("");
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("UNSUPPORTED");
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" }, width: { ideal: 1280 }, height: { ideal: 1920 } },
        audio: false,
      });
      if (requestId !== requestRef.current) {
        nextStream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = nextStream;
      setStream(nextStream);
    } catch (cameraError) {
      if (requestId !== requestRef.current) return;
      setError(
        cameraError.name === "NotAllowedError"
          ? "카메라 접근이 필요합니다. Camera access is needed."
          : cameraError.message === "UNSUPPORTED"
            ? "이 브라우저는 카메라를 지원하지 않습니다."
            : "카메라 연결 실패. Camera could not be opened.",
      );
    }
  }

  useEffect(() => {
    connect();
    return () => {
      requestRef.current += 1;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  return { stream, error, connect };
}

export default function FrameSelector({
  selectedFrame,
  onSelect,
  onContinue,
  onBack,
  language,
  selectedFilter,
  onFilterSelect,
  selectedBackground,
  onBackgroundSelect,
}) {
  const isMn = language === "MN";
  const { stream, error, connect } = useSelectionCamera();

  return (
    <div className="frame-selector screen-enter">
      <div className="frame-header">
        <div>
          <p className="overline">{isMn ? "01 / 03 · 프레임 선택" : "01 / 03 · SELECT FRAME"}</p>
          <h1>{isMn ? "프레임을 선택하세요" : "Choose your frame"}</h1>
          <p className="frame-description">{isMn ? "원하는 레이아웃을 터치하세요." : "Tap a layout to select it."}</p>
        </div>
        <div className={`frame-live-status ${stream ? "connected" : ""}`}>
          <span className="live-dot" />
          <span className="live-label">
            {stream
              ? (isMn ? "카메라 연결됨" : "CAMERA LIVE")
              : error
                ? (isMn ? "카메라 필요" : "CAMERA NEEDED")
                : (isMn ? "연결 중..." : "CONNECTING")}
          </span>
        </div>
      </div>
      {error && (
        <div className="frame-camera-error" role="status">
          <span>{error}</span>
          <button type="button" onClick={connect}>{isMn ? "카메라 연결" : "Enable camera"}</button>
        </div>
      )}
      <div className="frame-list">
        {frames.map((frame, index) => {
          const active = selectedFrame.id === frame.id;
          return (
            <button type="button" key={frame.id} className={`frame-option ${active ? "active" : ""}`} onClick={() => onSelect(frame)} aria-pressed={active}>
              <span className="frame-topline">
                <span>{String(index + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}</span>
                <span className="frame-selected-mark">{active ? "✓" : ""}</span>
              </span>
              <FramePreview frame={frame} stream={stream} filter={selectedFilter.css} active={active} background={selectedBackground} />
              <span className="frame-info">
                <b>{isMn ? frame.mn : frame.name}</b>
                <small>{isMn ? `${frame.photoCount} 장` : `${frame.photoCount} photos`}</small>
              </span>
            </button>
          );
        })}
      </div>
      <div className="design-options">
        <div className="edit-group">
          <span className="edit-label">{isMn ? "배경 색상" : "BACKGROUND COLOR"}</span>
          <BackgroundSelector selected={selectedBackground} onSelect={onBackgroundSelect} language={language} />
        </div>
        <div className="edit-group">
          <span className="edit-label">{isMn ? "필터 선택" : "PHOTO FILTER"}</span>
          <FilterSelector selected={selectedFilter} onSelect={onFilterSelect} language={language} />
        </div>
      </div>
      <div className="frame-footer">
        <button className="text-button" type="button" onClick={onBack}>← {isMn ? "돌아가기" : "Back"}</button>
        <button className="primary-button" type="button" onClick={onContinue}>{isMn ? "촬영하기" : "Take photos"} <span>→</span></button>
      </div>
    </div>
  );
}
