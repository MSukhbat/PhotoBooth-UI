import React, { useState } from "react";
import { kioskAudio } from "../../utils/kioskAudio";

export default function ThreeDOrderReceipt({
  language,
  selectedScale,
  selectedMaterial,
  selectedBase,
  onFinish,
}) {
  const isMn = language === "MN";
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState("pickup"); // "pickup" or "courier"
  const [address, setAddress] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const jobTicketNumber = `#3D-FIG-${Math.floor(10000 + Math.random() * 90000)}`;

  function handleSubmit() {
    if (!phone) return;
    kioskAudio.playSuccess();
    setIsSubmitted(true);
  }

  return (
    <div className="step-screen three-d-receipt-screen screen-enter">
      <div className="three-d-header text-center">
        <div className="step-number-badge highlight-green">3D PRINT DATABASE QUEUE</div>
        <h1 className="step-title">
          {isSubmitted
            ? (isMn ? "3D Баримлын захиалга баталгаажлаа!" : "3D Print Ticket Confirmed!")
            : (isMn ? "Хүлээн авах мэдээллээ бүртгүүлнэ үү" : "Customer Contact & Delivery Registration")}
        </h1>
        <p className="step-desc">
          {isSubmitted
            ? (isMn
                ? "Таны 3D модель хэвлэгчийн бааз руу амжилттай дамжиж үйлдвэрлэлд шилжлээ"
                : "Your 3D model data is dispatched to the industrial resin print queue")
            : (isMn
                ? "Баримал бэлэн болоход мессежээр мэдэгдэх утасны дугаараа оруулна уу"
                : "Enter your mobile number for production tracking SMS notifications")}
        </p>
      </div>

      <div className="three-d-receipt-container">
        {isSubmitted ? (
          <div className="receipt-confirmed-card">
            <div className="receipt-top-banner">
              <span className="receipt-check-circle">✓</span>
              <h2>{isMn ? "ЗАХИАЛГА АМЖИЛТТАЙ БҮРТГЭГДЛЭЭ" : "DISPATCHED TO 3D PRINTER"}</h2>
              <span className="ticket-id-tag">{jobTicketNumber}</span>
            </div>

            <div className="receipt-details-grid">
              <div className="receipt-item">
                <span>{isMn ? "Баримлын хэмжээ:" : "Scale:"}</span>
                <strong>{selectedScale.name}</strong>
              </div>
              <div className="receipt-item">
                <span>{isMn ? "Хэвлэх материал:" : "Material:"}</span>
                <strong>{selectedMaterial.name}</strong>
              </div>
              <div className="receipt-item">
                <span>{isMn ? "Суурь:" : "Base:"}</span>
                <strong>{selectedBase.name}</strong>
              </div>
              <div className="receipt-item">
                <span>{isMn ? "Хүлээн авах хэлбэр:" : "Fulfillment:"}</span>
                <strong>{deliveryType === "pickup" ? (isMn ? "Салбараас авах" : "Store Pickup") : (isMn ? "Хүргэлт" : "Courier Delivery")}</strong>
              </div>
              <div className="receipt-item">
                <span>{isMn ? "Холбогдох утас:" : "Contact Phone:"}</span>
                <strong>{phone}</strong>
              </div>
              <div className="receipt-item">
                <span>{isMn ? "Үйлдвэрлэх хугацаа:" : "Estimated Ready:"}</span>
                <strong className="text-green">24 - 48 {isMn ? "цаг" : "Hours"}</strong>
              </div>
            </div>

            {/* Tracking QR Code */}
            <div className="receipt-tracking-qr-box">
              <div className="tracking-qr-graphic">
                <svg width="88" height="88" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="#ffffff" rx="8" />
                  <rect x="8" y="8" width="28" height="28" fill="#121216" rx="4" />
                  <rect x="13" y="13" width="18" height="18" fill="#ffffff" />
                  <rect x="18" y="18" width="8" height="8" fill="#121216" />

                  <rect x="64" y="8" width="28" height="28" fill="#121216" rx="4" />
                  <rect x="69" y="13" width="18" height="18" fill="#ffffff" />
                  <rect x="74" y="18" width="8" height="8" fill="#121216" />

                  <rect x="8" y="64" width="28" height="28" fill="#121216" rx="4" />
                  <rect x="13" y="69" width="18" height="18" fill="#ffffff" />
                  <rect x="18" y="74" width="8" height="8" fill="#121216" />

                  <rect x="42" y="10" width="6" height="6" fill="#121216" />
                  <rect x="52" y="14" width="6" height="6" fill="#121216" />
                  <rect x="42" y="42" width="16" height="16" fill="#2dd36f" rx="3" />
                  <rect x="66" y="44" width="6" height="6" fill="#121216" />
                  <rect x="44" y="76" width="6" height="6" fill="#121216" />
                  <rect x="74" y="74" width="6" height="6" fill="#121216" />
                </svg>
              </div>
              <div className="tracking-qr-info">
                <strong>{isMn ? "3D ХЭВЛЭЛТИЙГ ШУУД ХЯНАХ QR" : "SCAN TO TRACK 3D PRINT STATUS"}</strong>
                <span>
                  {isMn
                    ? "Утасныхаа камераар QR кодыг уншуулж 3D баримлын хэвлэлтийн явцыг онлайнаар шалгаарай"
                    : "Scan to track real-time UV resin curing & delivery progress on your mobile"}
                </span>
              </div>
            </div>

            <button type="button" className="nav-btn btn-primary btn-green full-width-btn" onClick={onFinish}>
              {isMn ? "Дуусгах / Баярлалаа" : "Finish / Thank You"} ✓
            </button>
          </div>
        ) : (
          <div className="receipt-form-card">
            <div className="form-group">
              <label className="form-label">
                {isMn ? "1. Холбоо барих гар утасны дугаар (Мэдэгдэл илгээх):" : "1. Contact Mobile Number (SMS Status Tracking):"}
              </label>
              <input
                type="tel"
                placeholder={isMn ? "Жишээ нь: 99112233" : "e.g. +976 99112233"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="kiosk-input-field"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {isMn ? "2. Баримал хүлээн авах хэлбэр:" : "2. Fulfillment Preference:"}
              </label>
              <div className="delivery-type-toggle">
                <button
                  type="button"
                  className={`delivery-btn ${deliveryType === "pickup" ? "active" : ""}`}
                  onClick={() => setDeliveryType("pickup")}
                >
                  🏬 {isMn ? "Салбараас өөрөө авах (Үнэгүй)" : "Store Self-Pickup (Free)"}
                </button>
                <button
                  type="button"
                  className={`delivery-btn ${deliveryType === "courier" ? "active" : ""}`}
                  onClick={() => setDeliveryType("courier")}
                >
                  🚚 {isMn ? "Хүргэлтээр авах" : "Express Courier Delivery"}
                </button>
              </div>
            </div>

            {deliveryType === "courier" && (
              <div className="form-group">
                <label className="form-label">
                  {isMn ? "Хүргэлтийн дэлгэрэнгүй хаяг:" : "Delivery Address Details:"}
                </label>
                <textarea
                  placeholder={isMn ? "Хот, Дүүрэг, Хороо, Байр, Тоот..." : "City, District, Building, Apartment..."}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="kiosk-textarea-field"
                  rows={2}
                />
              </div>
            )}

            <div className="form-action-row">
              <button
                type="button"
                className="btn-primary btn-green submit-order-btn"
                disabled={!phone}
                onClick={handleSubmit}
              >
                {isMn ? "3D ХЭВЛЭХ ДАРААЛАЛД БҮРТГҮҮЛЭХ" : "SUBMIT TO 3D PRINT QUEUE"} →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
