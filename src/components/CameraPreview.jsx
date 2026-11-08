import React, { useEffect, useRef, useState } from "react";
import Countdown from "./Countdown";
import { generateDemoPhotos } from "../utils/demoPhotos";
import { kioskAudio } from "../utils/kioskAudio";
import { createTimelapseClip } from "../utils/timelapseVideo";

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const CAMERA_ANGLES = [
  { id: 1, name: "CAM 01: FRONT (0°)", mn: "Камер 1: Эгц урд (0°)", transform: "none" },
  { id: 2, name: "CAM 02: FRONT-LEFT (45°)", mn: "Камер 2: Зүүн урд (45°)", transform: "perspective(300px) rotateY(-15deg)" },
  { id: 3, name: "CAM 03: LEFT (90°)", mn: "Камер 3: Зүүн хажуу (90°)", transform: "perspective(300px) rotateY(-30deg)" },
  { id: 4, name: "CAM 04: BACK-LEFT (135°)", mn: "Камер 4: Зүүн ар (135°)", transform: "perspective(300px) rotateY(-45deg)" },
  { id: 5, name: "CAM 05: BACK (180°)", mn: "Камер 5: Эгц ар (180°)", transform: "scaleX(1)" },
  { id: 6, name: "CAM 06: BACK-RIGHT (225°)", mn: "Камер 6: Баруун ар (225°)", transform: "perspective(300px) rotateY(45deg)" },
  { id: 7, name: "CAM 07: RIGHT (270°)", mn: "Камер 7: Баруун хажуу (270°)", transform: "perspective(300px) rotateY(30deg)" },
  { id: 8, name: "CAM 08: FRONT-RIGHT (315°)", mn: "Камер 8: Баруун урд (315°)", transform: "perspective(300px) rotateY(15deg)" },
];

export default function CameraPreview({
  language,
  filter,
  mode = "2d",
  onComplete,
  onBack,
}) {
  const isMn = language === "MN";
  const [cameraReady, setCameraReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [capturedCount, setCapturedCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);
  const [is3DScanning, setIs3DScanning] = useState(false);
  const [scanLinesProgress, setScanLinesProgress] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const sequenceRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const recordedVideoChunksRef = useRef([]);

  const TOTAL_SHOTS = 8; // Booth automatically takes 8 pictures

  useEffect(() => {
    let active = true;
    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraReady(false);
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (active) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
          setCameraReady(true);
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
      } catch (err) {
        console.warn("Camera not available. Running in simulated studio mode.", err);
        if (active) {
          setCameraReady(false);
        }
      }
    }

    startCamera();
    return () => {
      active = false;
      sequenceRef.current += 1;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function startLiveVideoRecording() {
    if (cameraReady && streamRef.current && typeof MediaRecorder !== "undefined") {
      try {
        recordedVideoChunksRef.current = [];
        const recorder = new MediaRecorder(streamRef.current);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedVideoChunksRef.current.push(e.data);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.warn("Could not start live media recorder", e);
      }
    }
  }

  function stopLiveVideoRecording() {
    return new Promise((resolve) => {
      const rec = mediaRecorderRef.current;
      if (rec && rec.state !== "inactive") {
        rec.onstop = () => {
          const blob = new Blob(recordedVideoChunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
        rec.stop();
      } else {
        resolve(null);
      }
    });
  }

  function captureCurrentFrame(shotIndex = 0) {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (cameraReady && video && canvas && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (mode === "3d") {
          ctx.strokeStyle = "rgba(45, 211, 111, 0.45)";
          ctx.lineWidth = 2;
          for (let x = 0; x < canvas.width; x += 45) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += 45) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
          ctx.fillStyle = "#2dd36f";
          ctx.font = "bold 22px monospace";
          ctx.fillText(`CAM_0${shotIndex + 1}_360_CONTOUR_SYNC`, 30, 45);
        }

        ctx.restore();
        return canvas.toDataURL("image/jpeg", 0.92);
      }
    }

    const demoPhotos = generateDemoPhotos();
    return demoPhotos[shotIndex % demoPhotos.length];
  }

  // 2D Shooting: 8 shots sequence with Behind-The-Scenes Video Recording
  async function start2DShooting() {
    if (busy) return;
    const seqId = ++sequenceRef.current;
    setBusy(true);
    setCapturedCount(0);
    const photos = [];

    // Start behind the scenes video capture
    startLiveVideoRecording();

    try {
      for (let shot = 0; shot < TOTAL_SHOTS; shot++) {
        for (let sec = 3; sec > 0; sec--) {
          if (seqId !== sequenceRef.current) return;
          setCountdown(sec);
          await delay(1000);
        }
        if (seqId !== sequenceRef.current) return;

        kioskAudio.playShutter();
        setFlash(true);
        setTimeout(() => setFlash(false), 200);

        const imgData = captureCurrentFrame(shot);
        photos.push(imgData);
        setCapturedCount(photos.length);
        setCountdown(null);

        if (shot + 1 < TOTAL_SHOTS) {
          await delay(800);
        }
      }

      if (seqId !== sequenceRef.current) return;

      // Stop video recording and generate clip
      let videoUrl = await stopLiveVideoRecording();
      if (!videoUrl) {
        // Fallback: generate high-quality timelapse from captured shots
        videoUrl = await createTimelapseClip(photos);
      }

      onComplete(photos, videoUrl);
    } catch (err) {
      console.error(err);
    } finally {
      if (seqId === sequenceRef.current) {
        setBusy(false);
        setCountdown(null);
      }
    }
  }

  // Quick Test Shots
  async function handleInstantShoot() {
    const demo = generateDemoPhotos();
    const clipUrl = await createTimelapseClip(demo);
    onComplete(demo, clipUrl);
  }

  // 3D Shooting: 8 simultaneous cameras
  async function start3DScanning() {
    if (busy) return;
    setBusy(true);
    setIs3DScanning(true);

    for (let sec = 3; sec > 0; sec--) {
      setCountdown(sec);
      await delay(1000);
    }
    setCountdown(null);

    for (let p = 0; p <= 100; p += 15) {
      setScanLinesProgress(p);
      await delay(100);
    }

    kioskAudio.playShutter();
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    const angles = [];
    for (let i = 0; i < 8; i++) {
      angles.push(captureCurrentFrame(i));
    }

    await delay(500);
    setIs3DScanning(false);
    setBusy(false);
    onComplete(angles, null);
  }

  return (
    <div className={`step-screen camera-screen ${mode === "3d" ? "mode-3d-screen" : ""} screen-enter`}>
      {flash && <div className="camera-flash-overlay" />}

      <div className="camera-header-row">
        <div>
          <span className="step-number-badge">
            {mode === "3d" ? "8-CAMERA 3D CAPTURE" : "AUTO 8-SHOT SHOOTING"}
          </span>
          <h1 className="step-title">
            {mode === "3d"
              ? (isMn ? "8 Камерын 3D Скан ажиллаж байна" : "8-Camera 3D Synchronous Scan")
              : (isMn ? "Камер руу хараарай (Нийт 8 зураг)" : "Look at the Camera (8 Shots)")}
          </h1>
          <p className="step-desc">
            {mode === "3d"
              ? (isMn
                  ? "8 камер таны бүх талын шугам, биеийн хэмжээг 360° бүртгэнэ"
                  : "8 cameras simultaneously capture your complete contours for 3D printing")
              : (isMn
                  ? "Зураг авалтын бичлэг давхар хийгдэх тул поозтой хөөрхөн инээгээрэй!"
                  : "Behind-the-scenes video is also recording automatically! Strike your cutie poses!")}
          </p>
        </div>

        <div className="camera-header-tools">
          <div className="camera-status-tag">
            <span className={`status-dot ${cameraReady ? "live" : "simulated"}`} />
            <span>
              {cameraReady
                ? (isMn ? "КАМЕР БЭЛЭН" : "CAMERA LIVE")
                : (isMn ? "СТУДИ ГОРИМ" : "STUDIO SIMULATION")}
            </span>
          </div>

          <button
            type="button"
            className="instant-test-btn"
            onClick={handleInstantShoot}
            title={isMn ? "Тест зургаар шууд үргэлжлүүлэх" : "Proceed immediately with studio sample photos"}
          >
            ⚡ {isMn ? "Шууд зураг авах" : "Quick Test Photos"}
          </button>
        </div>
      </div>

      {mode === "3d" ? (
        <div className="three-d-camera-array">
          <div className="three-d-grid">
            {CAMERA_ANGLES.map((cam, idx) => (
              <div key={cam.id} className="camera-angle-feed">
                <div className="angle-video-wrap" style={{ transform: cam.transform }}>
                  {cameraReady ? (
                    <video
                      ref={idx === 0 ? videoRef : null}
                      autoPlay
                      playsInline
                      muted
                      className="array-video"
                      style={{ filter: filter?.css || "none" }}
                    />
                  ) : (
                    <div className="camera-simulated-viewport">
                      <div className="simulated-avatar">
                        <span className="sim-pose-icon">{["✌️", "🫶", "✨", "😉", "🕶️", "🌸", "🐱", "💖"][idx]}</span>
                        <small>ANGLE #{idx + 1}</small>
                      </div>
                    </div>
                  )}

                  {is3DScanning && (
                    <div
                      className="scan-line-horizontal"
                      style={{ top: `${scanLinesProgress}%` }}
                    />
                  )}
                  <div className="camera-viewfinder-brackets">
                    <span className="vf tl" />
                    <span className="vf tr" />
                    <span className="vf bl" />
                    <span className="vf br" />
                  </div>
                </div>
                <div className="angle-info-bar">
                  <span className="angle-id">{isMn ? cam.mn : cam.name}</span>
                  <span className="angle-status">{is3DScanning ? "SCANNING..." : "ACTIVE"}</span>
                </div>
              </div>
            ))}
          </div>

          <Countdown value={countdown} />
        </div>
      ) : (
        <div className="camera-stage-2d">
          <div className="camera-viewport-frame">
            {cameraReady ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="live-camera-video"
                style={{ filter: filter?.css || "none" }}
              />
            ) : (
              <div className="camera-simulated-viewport">
                <div className="simulated-avatar">
                  <span className="sim-pose-icon">👤</span>
                  <h3>{isMn ? "Студийн бэлэн байдал" : "Studio Ready"}</h3>
                  <p>
                    {isMn
                      ? "Камер залгагдаагүй үед автоматаар студийн тест зургаар ажиллана"
                      : "Camera not connected. Studio simulation mode active."}
                  </p>
                </div>
              </div>
            )}

            {/* Video recording indicator */}
            {busy && (
              <div className="video-recording-watermark">
                <span className="rec-red-dot" />
                <span>REC · LIVE BTS VIDEO</span>
              </div>
            )}

            <div className="camera-guides-layer">
              <div className="vf-corner tl" />
              <div className="vf-corner tr" />
              <div className="vf-corner bl" />
              <div className="vf-corner br" />
              <div className="vf-center-crosshair">
                <span className="ch-line h" />
                <span className="ch-line v" />
              </div>
              <div className="vf-lens-prompt">
                {isMn ? "ЛЕНЗ РҮҮ ЭГЦ ХАРААРАЙ" : "LOOK STRAIGHT AT THE LENS"}
              </div>
            </div>

            <Countdown value={countdown} />
          </div>

          <div className="shot-tracker-bar">
            {Array.from({ length: TOTAL_SHOTS }).map((_, i) => (
              <div
                key={i}
                className={`shot-dot-pill ${i < capturedCount ? "taken" : ""} ${i === capturedCount && busy ? "current" : ""}`}
              >
                <span>{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="camera-controls-bottom">
        <button
          type="button"
          className="nav-btn btn-secondary"
          onClick={onBack}
          disabled={busy}
        >
          ← {isMn ? "Буцах" : "Back"}
        </button>

        <div className="camera-center-action">
          {busy ? (
            <div className="shooting-in-progress-pill">
              <span className="pulsing-rec" />
              <span>
                {mode === "3d"
                  ? (isMn ? "3D СКАН ХИЙЖ БАЙНА..." : "3D SCANNING IN PROGRESS...")
                  : (isMn ? `ЗУРАГ АВЧ БАЙНА (${capturedCount}/${TOTAL_SHOTS})` : `SHOOTING (${capturedCount}/${TOTAL_SHOTS})`)}
              </span>
            </div>
          ) : (
            <button
              type="button"
              className="kiosk-big-shutter-btn always-active"
              onClick={mode === "3d" ? start3DScanning : start2DShooting}
            >
              <div className="shutter-inner-ring">
                <span className="shutter-camera-icon">📸</span>
              </div>
              <span className="shutter-label">
                {mode === "3d"
                  ? (isMn ? "3D СКАН ЭХЛҮҮЛЭХ" : "START 3D SCAN")
                  : (isMn ? "ЗУРАГ АВАХ (8 ЗУРАГ)" : "START 8 SHOTS")}
              </span>
            </button>
          )}
        </div>

        <div className="camera-counter-badge">
          <strong>{capturedCount}</strong> / {TOTAL_SHOTS}
        </div>
      </div>

      <canvas ref={canvasRef} hidden />
    </div>
  );
}
