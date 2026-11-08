import React, { useEffect, useState } from "react";

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load photo asset."));
    image.src = source;
  });
}

export default function FinalPreview({ photos, frame, background, filter, language, onFinish }) {
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const isMn = language === "MN";

  useEffect(() => {
    let active = true;
    setImageUrl("");
    setError("");

    async function renderStrip() {
      try {
        if (!photos.length) throw new Error("No photos available.");
        const images = await Promise.all(photos.map(loadImage));
        if (!active) return;

        const isHorizontal = frame.orientation === "horizontal";
        const canvas = document.createElement("canvas");
        canvas.width = isHorizontal ? 1600 : 1200;
        canvas.height = isHorizontal ? 1200 : 1600;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Fill background color
        ctx.fillStyle = background.color || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pattern decorative elements for Event Frames
        if (background.pattern === "blossom") {
          ctx.fillStyle = "rgba(255, 183, 197, 0.45)";
          for (let i = 20; i < canvas.width; i += 120) {
            ctx.beginPath();
            ctx.arc(i, 20, 10, 0, Math.PI * 2);
            ctx.arc(i + 15, 30, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (background.pattern === "hearts") {
          ctx.fillStyle = "rgba(251, 111, 146, 0.35)";
          for (let i = 40; i < canvas.width; i += 140) {
            ctx.font = "24px sans-serif";
            ctx.fillText("♥", i, 30);
          }
        } else if (background.pattern === "film") {
          ctx.fillStyle = "#ffffff";
          for (let y = 15; y < canvas.height; y += 40) {
            ctx.fillRect(10, y, 14, 20);
            ctx.fillRect(canvas.width - 24, y, 14, 20);
          }
        }

        const pad = background.pattern === "film" ? 60 : 44;
        const top = 48;
        const footer = 120;
        const gap = 14;

        const gridWidth = canvas.width - pad * 2;
        const gridHeight = canvas.height - top - footer - pad;
        const cellWidth = (gridWidth - gap * (frame.columns - 1)) / frame.columns;
        const cellHeight = (gridHeight - gap * (frame.rows - 1)) / frame.rows;

        // Draw each photo
        images.forEach((img, idx) => {
          const col = idx % frame.columns;
          const row = Math.floor(idx / frame.columns);
          const x = pad + col * (cellWidth + gap);
          const y = top + row * (cellHeight + gap);

          const scale = Math.max(cellWidth / img.width, cellHeight / img.height);
          const drawW = cellWidth / scale;
          const drawH = cellHeight / scale;

          ctx.save();
          // Rounded corners
          const r = 8;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + cellWidth - r, y);
          ctx.quadraticCurveTo(x + cellWidth, y, x + cellWidth, y + r);
          ctx.lineTo(x + cellWidth, y + cellHeight - r);
          ctx.quadraticCurveTo(x + cellWidth, y + cellHeight, x + cellWidth - r, y + cellHeight);
          ctx.lineTo(x + r, y + cellHeight);
          ctx.quadraticCurveTo(x, y + cellHeight, x, y + cellHeight - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.clip();

          if ("filter" in ctx && filter?.css) {
            ctx.filter = filter.css;
          }
          ctx.drawImage(
            img,
            (img.width - drawW) / 2,
            (img.height - drawH) / 2,
            drawW,
            drawH,
            x,
            y,
            cellWidth,
            cellHeight
          );
          ctx.restore();
        });

        // Footer typography (Clean Mongolian / English photobooth branding, NO Korean)
        const isDarkBg = !background.darkText;
        ctx.textAlign = "center";

        ctx.fillStyle = isDarkBg ? "#f5f5f7" : "#222227";
        ctx.font = "bold 30px 'Noto Sans KR', sans-serif";
        ctx.fillText("PHOTO BOOTH STUDIO", canvas.width / 2, canvas.height - 76);

        ctx.fillStyle = isDarkBg ? "#a0a0ab" : "#666670";
        ctx.font = "600 15px 'Noto Sans KR', sans-serif";
        ctx.fillText("SELF-SERVICE KIOSK · MEMORY STRIP", canvas.width / 2, canvas.height - 50);

        ctx.fillStyle = isDarkBg ? "#777785" : "#9999a3";
        ctx.font = "500 13px sans-serif";
        const dateStr = new Date().toLocaleDateString(isMn ? "mn-MN" : "en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        ctx.fillText(dateStr, canvas.width / 2, canvas.height - 28);

        if (active) setImageUrl(canvas.toDataURL("image/png"));
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    renderStrip();
    return () => {
      active = false;
    };
  }, [photos, frame, background, filter, language, isMn]);

  function handleDownload() {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `photobooth-${Date.now()}.png`;
    link.click();
    onFinish();
  }

  return (
    <div className="final-preview-container">
      <div className="final-preview-card" style={{ borderColor: background.border }}>
        {imageUrl ? (
          <img src={imageUrl} alt="Finished photo strip" className="final-strip-img" />
        ) : (
          <div className="final-loading-box">
            <div className="spinner" />
            <p>{error || (isMn ? "Зургийн хуудсыг бэлдэж байна..." : "Preparing your photo strip...")}</p>
          </div>
        )}
      </div>

      <div className="final-actions-panel">
        <button
          type="button"
          className="print-save-btn"
          disabled={!imageUrl}
          onClick={handleDownload}
        >
          <span className="btn-icon">🖨️</span>
          <span>{isMn ? "ЗУРГАА ХЭВЛЭХ & ТАТАХ ↓" : "PRINT & SAVE PHOTO ↓"}</span>
        </button>
      </div>
    </div>
  );
}
