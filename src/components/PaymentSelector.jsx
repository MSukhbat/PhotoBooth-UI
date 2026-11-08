import React, { useEffect, useRef, useState } from "react";

export default function PaymentSelector({
  language,
  frame,
  quantity,
  mode = "2d",
  threeDScale,
  onPaymentSuccess,
  onBack,
  filter,
}) {
  const isMn = language === "MN";
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
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

  const totalMNT = mode === "3d"
    ? (threeDScale?.priceMNT || 125000)
    : (frame.priceMNT || 10000) * quantity;

  const totalUSD = mode === "3d"
    ? (threeDScale?.priceUSD || 42)
    : (frame.priceUSD || 4.0) * quantity;

  function handlePay(method) {
    setSelectedMethod(method);
    setIsProcessing(true);
    setStatusMessage(
      method === "card"
        ? (isMn ? "Картыг терминалд уншуулж байна..." : "Reading credit card...")
        : method === "qpay"
          ? (isMn ? "QPay QR кодыг шалгаж байна..." : "Verifying QPay QR code...")
          : (isMn ? "Бэлэн мөнгийг шалгаж байна..." : "Validating cash bills...")
    );

    setTimeout(() => {
      setStatusMessage(
        isMn ? "Төлбөр амжилттай баталгаажлаа! ✓" : "Payment Approved! ✓"
      );
      setTimeout(() => {
        onPaymentSuccess();
      }, 900);
    }, 1500);
  }

  return (
    <div className="step-screen payment-screen screen-enter">
      {/* Live mirror background matching Korean kiosk image 3 */}
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

      <div className="payment-dialog-wrapper">
        <h2 className="payment-title">
          {isMn ? "Төлбөрийн хэрэгсэл сонгох" : "Payment Method"}
        </h2>
        <p className="payment-subtitle">
          {mode === "3d"
            ? (isMn
                ? `3D Баримал (${threeDScale?.name}): ${totalMNT.toLocaleString()}₮`
                : `3D Figurine Order (${threeDScale?.name}): $${totalUSD.toFixed(2)}`)
            : (isMn
                ? `Төлөх дүн: ${totalMNT.toLocaleString()}₮ (${quantity} хувь)`
                : `Total Amount: $${totalUSD.toFixed(2)} (${quantity} sets)`)}
        </p>

        {isProcessing ? (
          <div className="payment-processing-box">
            <div className="payment-spinner" />
            <p className="payment-status-text">{statusMessage}</p>
          </div>
        ) : (
          <div className="payment-methods-grid">
            <button
              type="button"
              className={`payment-method-card ${selectedMethod === "card" ? "active" : ""}`}
              onClick={() => handlePay("card")}
            >
              <div className="method-label-top">CREDIT CARD</div>
              <div className="card-mock-visual">
                <div className="card-stripe" />
                <div className="card-chip" />
                <div className="card-nfc-waves">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="method-title-bottom">
                {isMn ? "Банкны карт" : "Card Payment"}
              </div>
            </button>

            <button
              type="button"
              className={`payment-method-card ${selectedMethod === "qpay" ? "active" : ""}`}
              onClick={() => handlePay("qpay")}
            >
              <div className="method-label-top">MOBILE QR</div>
              <div className="qpay-mock-visual">
                <div className="qr-box">
                  <div className="qr-corner tl" />
                  <div className="qr-corner tr" />
                  <div className="qr-corner bl" />
                  <div className="qr-corner br" />
                  <div className="qr-center-dot" />
                </div>
              </div>
              <div className="method-title-bottom">
                {isMn ? "QPay / QR уншуулах" : "QPay / Mobile QR"}
              </div>
            </button>

            <button
              type="button"
              className={`payment-method-card ${selectedMethod === "cash" ? "active" : ""}`}
              onClick={() => handlePay("cash")}
            >
              <div className="method-label-top">CASH BILL</div>
              <div className="cash-mock-visual">
                <div className="cash-bill-top">10,000₮</div>
                <div className="cash-bill-slot" />
              </div>
              <div className="method-title-bottom">
                {isMn ? "Бэлэн мөнгө" : "Cash Terminal"}
              </div>
            </button>
          </div>
        )}

        <div className="payment-helper-text">
          {mode === "3d"
            ? (isMn
                ? "Төлбөр төлөгдсөний дараа 8 камерын 3D скан шууд эхэлнэ"
                : "8-Camera 3D Synchronous Scan begins immediately upon payment authorization")
            : (isMn
                ? "Төлбөр төлөгдсөний дараа зураг авалт шууд эхэлнэ"
                : "Photo session begins immediately upon payment authorization")}
        </div>
      </div>

      <div className="step-bottom-bar transparent-bar">
        <button
          type="button"
          className="nav-btn btn-secondary"
          onClick={onBack}
          disabled={isProcessing}
        >
          ← {isMn ? "Буцах" : "Back"}
        </button>
      </div>
    </div>
  );
}
