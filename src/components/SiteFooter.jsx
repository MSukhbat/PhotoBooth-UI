import React from "react";

export default function SiteFooter({ language, mode }) {
  const isMn = language === "MN";

  return (
    <footer className="site-footer">
      <div className="footer-left">
        <span className="footer-brand">PHOTO BOOTH STUDIO</span>
        <span className="footer-dot">•</span>
        <span className="footer-mode">
          {mode === "3d"
            ? (isMn ? "8-Камер 3D Скан Систем" : "8-Camera 3D Scan System")
            : (isMn ? "Сонгодог Фото Киоск" : "Classic Photo Kiosk")}
        </span>
      </div>

      <div className="footer-center">
        <span>
          {isMn
            ? "ШҮҮЛТҮҮР → ХЭМЖЭЭ → ТОО ШИРХЭГ → ТӨЛБӨР → 8 ЗУРАГ АВАХ → ХЭВЛЭХ"
            : "FILTER → CUT SIZE → QUANTITY → PAYMENT → 8 SHOTS → PRINT"}
        </span>
      </div>

      <div className="footer-right">
        <span>{isMn ? "Монгол / English" : "Mongolian / English"}</span>
      </div>
    </footer>
  );
}
