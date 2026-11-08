import React, { useState } from "react";
import CutSizeSelector from "./components/CutSizeSelector";
import QuantitySelector from "./components/QuantitySelector";
import PaymentSelector from "./components/PaymentSelector";
import CameraPreview from "./components/CameraPreview";
import PhotoPickerScreen from "./components/PhotoPickerScreen";
import PreviewScreen from "./components/PreviewScreen";
import ThreeDResultScreen from "./components/ThreeDResultScreen";
import FinishScreen from "./components/FinishScreen";
import SiteFooter from "./components/SiteFooter";
import TopBar from "./components/TopBar";
import WelcomeScreen from "./components/WelcomeScreen";

// 3D Specialized Components
import ThreeDConfigStep from "./components/threeD/ThreeDConfigStep";
import ThreeDPoseGuideStep from "./components/threeD/ThreeDPoseGuideStep";
import ThreeDOrderReceipt from "./components/threeD/ThreeDOrderReceipt";

import { basicFrames, eventFrames } from "./data/backgrounds";
import { filters } from "./data/filters";
import { frames } from "./data/frames";
import { threeDScales, threeDMaterials, threeDBases } from "./data/threeDProducts";
import { generateDemoPhotos } from "./utils/demoPhotos";

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [language, setLanguage] = useState("MN");
  const [mode, setMode] = useState("2d"); // "2d" or "3d"

  // 2D State
  const [frame, setFrame] = useState(frames[0]);
  const [filter, setFilter] = useState(filters[0]);
  const [background, setBackground] = useState(eventFrames[0]);
  const [quantity, setQuantity] = useState(2); // default 2 copies

  // 3D Figurine Configuration State
  const [threeDScale, setThreeDScale] = useState(threeDScales[1]); // 15cm Standard
  const [threeDMaterial, setThreeDMaterial] = useState(threeDMaterials[0]); // Full-Color UV Resin
  const [threeDBase, setThreeDBase] = useState(threeDBases[0]); // Walnut Wood Base

  // Raw photos (booth takes 8 photos)
  const [rawPhotos, setRawPhotos] = useState([]);

  // Selected photos for the 2D cuts (e.g. 4 chosen out of 8)
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Behind-The-Scenes Timelapse / Live Video Recording
  const [sessionVideoUrl, setSessionVideoUrl] = useState(null);

  function startOver() {
    setScreen("welcome");
    setMode("2d");
    setFrame(frames[0]);
    setFilter(filters[0]);
    setBackground(eventFrames[0]);
    setQuantity(2);
    setRawPhotos([]);
    setSelectedPhotos([]);
    setSessionVideoUrl(null);
  }

  function handleSelectMode(chosenMode) {
    setMode(chosenMode);
    if (chosenMode === "3d") {
      // 3D Flow: Dedicated 3D Figurine Configuration
      setScreen("threeDConfig");
    } else {
      // 2D Flow: Direct to Cut Sizes
      setScreen("cuts");
    }
  }

  // Page Expire Timer
  function getTimerSecondsForScreen(currScreen) {
    switch (currScreen) {
      case "cuts": return 60;
      case "quantity": return 45;
      case "payment": return 60;
      case "picker": return 90;
      case "preview": return 90;
      case "threeDConfig": return 75;
      case "threeDPoseGuide": return 60;
      default: return null;
    }
  }

  function handleTimerExpire() {
    if (screen === "cuts") {
      setScreen("quantity");
    } else if (screen === "quantity") {
      setScreen("payment");
    } else if (screen === "payment") {
      setScreen("camera");
    } else if (screen === "picker") {
      const pool = rawPhotos.length ? rawPhotos : generateDemoPhotos();
      const required = frame.photoCount || 4;
      setSelectedPhotos(pool.slice(0, required));
      setScreen("preview");
    } else if (screen === "preview") {
      setScreen("finish");
    } else if (screen === "threeDConfig") {
      setScreen("threeDPoseGuide");
    } else if (screen === "threeDPoseGuide") {
      setScreen("payment");
    }
  }

  return (
    <main className="booth-shell">
      <TopBar
        language={language}
        onLanguageChange={() => setLanguage(language === "MN" ? "EN" : "MN")}
        onHome={startOver}
        step={screen}
        mode={mode}
        timerSeconds={getTimerSecondsForScreen(screen)}
        onTimerExpire={handleTimerExpire}
      />

      <section className="stage" aria-live="polite">
        {/* Welcome & Mode Selection */}
        {screen === "welcome" && (
          <WelcomeScreen
            language={language}
            onSelectMode={handleSelectMode}
          />
        )}

        {/* ═══════════ 2D PHOTO STRIP FLOW ═══════════ */}

        {/* 2D Step 1: Choose Cut Sizes (Image 1) */}
        {screen === "cuts" && (
          <CutSizeSelector
            language={language}
            selectedFrame={frame}
            onSelectFrame={setFrame}
            onNext={() => setScreen("quantity")}
            onBack={() => setScreen("welcome")}
            filter={filter}
          />
        )}

        {/* 2D Step 2: Choose Quantity (Image 2) */}
        {screen === "quantity" && (
          <QuantitySelector
            language={language}
            quantity={quantity}
            onChangeQuantity={setQuantity}
            frame={frame}
            onNext={() => setScreen("payment")}
            onBack={() => setScreen("cuts")}
            filter={filter}
          />
        )}

        {/* ═══════════ 3D FIGURINE FLOW ═══════════ */}

        {/* 3D Step 1: Figurine Size, Material & Pedestal Config */}
        {screen === "threeDConfig" && (
          <ThreeDConfigStep
            language={language}
            selectedScale={threeDScale}
            onSelectScale={setThreeDScale}
            selectedMaterial={threeDMaterial}
            onSelectMaterial={setThreeDMaterial}
            selectedBase={threeDBase}
            onSelectBase={setThreeDBase}
            onNext={() => setScreen("threeDPoseGuide")}
            onBack={() => setScreen("welcome")}
          />
        )}

        {/* 3D Step 2: Posture & 8-Camera Calibration Guide */}
        {screen === "threeDPoseGuide" && (
          <ThreeDPoseGuideStep
            language={language}
            selectedScale={threeDScale}
            onNext={() => setScreen("payment")}
            onBack={() => setScreen("threeDConfig")}
          />
        )}

        {/* ═══════════ PAYMENT STEP (2D & 3D) ═══════════ */}

        {screen === "payment" && (
          <PaymentSelector
            language={language}
            frame={frame}
            quantity={quantity}
            mode={mode}
            threeDScale={threeDScale}
            onPaymentSuccess={() => setScreen("camera")}
            onBack={() => setScreen(mode === "3d" ? "threeDPoseGuide" : "quantity")}
            filter={filter}
          />
        )}

        {/* ═══════════ CAMERA SHOOTING (2D & 3D) ═══════════ */}

        {screen === "camera" && (
          <CameraPreview
            language={language}
            filter={filter}
            mode={mode}
            onComplete={(captured8Photos, videoUrl) => {
              setRawPhotos(captured8Photos);
              if (videoUrl) {
                setSessionVideoUrl(videoUrl);
              }
              if (mode === "3d") {
                setScreen("threeDResult");
              } else {
                setScreen("picker");
              }
            }}
            onBack={() => setScreen("payment")}
          />
        )}

        {/* 2D Step 4: Choose 4 out of 8 photos (Image 4 - NO Retake Button) */}
        {screen === "picker" && (
          <PhotoPickerScreen
            language={language}
            photos={rawPhotos.length ? rawPhotos : generateDemoPhotos()}
            frame={frame}
            filter={filter}
            onConfirmSelection={(chosenList) => {
              setSelectedPhotos(chosenList);
              setScreen("preview");
            }}
          />
        )}

        {/* 2D Step 5: Filter & Frame Carousel Customization (Image 5 - NO Retake Button) */}
        {screen === "preview" && (
          <PreviewScreen
            language={language}
            photos={selectedPhotos.length ? selectedPhotos : generateDemoPhotos().slice(0, frame.photoCount || 4)}
            frame={frame}
            filter={filter}
            background={background}
            onFilterSelect={setFilter}
            onBackgroundSelect={setBackground}
            onFinish={() => setScreen("finish")}
          />
        )}

        {/* 2D Step 6: Finish Screen with Physical Prints, QR Download & BTS Video Player */}
        {screen === "finish" && (
          <FinishScreen
            language={language}
            onRestart={startOver}
            sessionVideoUrl={sessionVideoUrl}
            photos={selectedPhotos}
          />
        )}

        {/* 3D Step 4: Interactive 360° Mesh & Point Cloud Inspector */}
        {screen === "threeDResult" && (
          <ThreeDResultScreen
            language={language}
            photos={rawPhotos.length ? rawPhotos : generateDemoPhotos()}
            selectedScale={threeDScale}
            selectedMaterial={threeDMaterial}
            selectedBase={threeDBase}
            onProceedToOrder={() => setScreen("threeDReceipt")}
            onRestart={startOver}
          />
        )}

        {/* 3D Step 5: 3D Print Database Submission & SMS Tracking Ticket */}
        {screen === "threeDReceipt" && (
          <ThreeDOrderReceipt
            language={language}
            selectedScale={threeDScale}
            selectedMaterial={threeDMaterial}
            selectedBase={threeDBase}
            onFinish={startOver}
          />
        )}
      </section>

      <SiteFooter language={language} mode={mode} />
    </main>
  );
}
