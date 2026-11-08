import React, { useEffect, useState } from "react";

export default function KioskTimer({
  initialSeconds = 60,
  onExpire,
  language = "MN",
  autoAdvance = true,
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const isMn = language === "MN";

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (autoAdvance && onExpire) {
        onExpire();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, autoAdvance, onExpire]);

  const isUrgent = secondsLeft <= 10;
  const minutes = Math.floor(secondsLeft / 60);
  const remainderSeconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(remainderSeconds).padStart(2, "0")}`;

  return (
    <div className={`kiosk-timer-pill ${isUrgent ? "urgent" : ""}`} title={isMn ? "Хугацаа дуусах" : "Time remaining"}>
      <span className="timer-icon">⏱️</span>
      <span className="timer-digits">{formattedTime}</span>
      <span className="timer-sec-label">{isMn ? "сек" : "s"}</span>
    </div>
  );
}
