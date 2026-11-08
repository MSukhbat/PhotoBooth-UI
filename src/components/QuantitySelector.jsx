import React, { useEffect, useRef, useState } from "react";

export default function QuantitySelector({
  language,
  quantity,
  onChangeQuantity,
  frame,
  onNext,
  onBack,
  filter,
}) {
  const isMn = language === "MN";
  const [hasCoupon, setHasCoupon] = useState(false);
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

  const unitPriceMNT = frame.priceMNT || 10000;
  const unitPriceUSD = frame.priceUSD || 4.0;
  const discountMultiplier = hasCoupon ? 0.9 : 1.0;
  const totalPriceMNT = Math.round(unitPriceMNT * quantity * discountMultiplier);
  const totalPriceUSD = Number((unitPriceUSD * quantity * discountMultiplier).toFixed(2));

  function increment() {
    if (quantity < 10) onChangeQuantity(quantity + 1);
  }

  function decrement() {
    if (quantity > 1) onChangeQuantity(quantity - 1);
  }

  return (
    <div className="step-screen quantity-screen screen-enter">
      {/* Live mirror background matching Korean kiosk image 2 */}
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

      <div className="quantity-dialog-wrapper">
        <h2 className="quantity-title">
          {isMn ? "Тоо ширхэг сонгох" : "Select Quantity"}
        </h2>
        <p className="quantity-sub">
          {isMn
            ? `${frame.mn} (${frame.cutLabel})`
            : `${frame.name} (${frame.cutLabel})`}
        </p>

        {/* Counter module with - [ number ] + matching photo 2 */}
        <div className="quantity-counter-row">
          <button
            type="button"
            className="qty-circle-btn"
            onClick={decrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>

          <div className="qty-number-box">
            <span className="qty-value">{quantity}</span>
          </div>

          <button
            type="button"
            className="qty-circle-btn"
            onClick={increment}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Price box matching photo 2 */}
        <div className="qty-price-box">
          <span className="qty-price-text">
            {isMn
              ? `${totalPriceMNT.toLocaleString()}₮`
              : `$${totalPriceUSD.toFixed(2)}`}
          </span>
          {hasCoupon && (
            <span className="coupon-applied-badge">
              {isMn ? "-10% хөнгөлөлт" : "-10% off"}
            </span>
          )}
        </div>

        {/* Coupon checkbox matching photo 2 */}
        <label className="qty-coupon-label">
          <input
            type="checkbox"
            checked={hasCoupon}
            onChange={(e) => setHasCoupon(e.target.checked)}
            className="coupon-checkbox"
          />
          <span className="coupon-checkbox-custom" />
          <span className="coupon-text">
            {isMn
              ? "Хөнгөлөлтийн купонтой бол энд чагтална уу"
              : "Check here if you have a discount coupon"}
          </span>
        </label>

        {/* Instruction pill matching bottom of photo 2 */}
        <div className="qty-instruction-pill">
          {isMn
            ? "Баруун доод буланд байрлах 'Үргэлжлүүлэх' товчийг дарна уу"
            : "Please press the Next button at the bottom right to continue"}
        </div>
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
