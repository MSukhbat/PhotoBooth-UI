import React, { useEffect } from "react";
import { kioskAudio } from "../utils/kioskAudio";

export default function Countdown({ value }) {
  useEffect(() => {
    if (value !== null && value > 0) {
      kioskAudio.playCountdownTick();
    }
  }, [value]);

  if (value === null) return null;

  return (
    <div key={value} className="countdown" role="status" aria-label={`Photo in ${value}`}>
      {value}
    </div>
  );
}
