import React from "react";
import KioskTimer from "./KioskTimer";

export default function TopBar({
  language,
  onLanguageChange,
  onHome,
  step,
  mode,
  timerSeconds,
  onTimerExpire,
}) {
  const isMn = language === "MN";
  const showTimer = step !== "welcome" && step !== "finish" && Boolean(timerSeconds);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="brand-button" type="button" onClick={onHome} aria-label="Go to start">
          <span className="brand-icon">4</span>
          <div className="brand-titles">
            <span className="brand-name">PHOTO<b>BOOTH</b></span>
            <span className="brand-tag">
              {mode === "3d"
                ? (isMn ? "8-КАМЕР 3D СИСТЕМ" : "8-CAMERA 3D SCAN")
                : (isMn ? "СОНГОДОГ ФОТО КИОСК" : "CLASSIC PHOTO KIOSK")}
            </span>
          </div>
        </button>
      </div>

      <div className="topbar-center">
        {showTimer ? (
          <KioskTimer
            initialSeconds={timerSeconds}
            onExpire={onTimerExpire}
            language={language}
          />
        ) : (
          <div className="kiosk-status-pill">
            <span className="kiosk-status-dot" />
            <span className="kiosk-status-text">
              {isMn ? "КИОСК ИДЭВХТЭЙ" : "KIOSK READY"}
            </span>
          </div>
        )}
      </div>

      <div className="topbar-tools">
        <button
          className="lang-pill"
          type="button"
          onClick={onLanguageChange}
          title={isMn ? "Хэл солих" : "Change language"}
        >
          <span className="lang-active">{language}</span>
          <span className="lang-other">{language === "MN" ? "EN" : "MN"}</span>
        </button>

        <button
          className="home-mini-btn"
          type="button"
          onClick={onHome}
          title={isMn ? "Эхлэл рүү буцах" : "Restart session"}
        >
          {isMn ? "Эхлэл" : "Restart"}
        </button>
      </div>
    </header>
  );
}
