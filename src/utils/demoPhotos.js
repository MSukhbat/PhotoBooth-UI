// Realistic photobooth studio sample portraits for testing without camera
export function generateDemoPhotos() {
  const poses = [
    { bg: "#e8edf2", hair: "#3a2d28", shirt: "#ff6b8b", acc: "✌️", title: "Peace Pose" },
    { bg: "#fcefe8", hair: "#232328", shirt: "#4a7bb0", acc: "🫶", title: "Heart Hands" },
    { bg: "#eef2e6", hair: "#4d382c", shirt: "#f4a261", acc: "✨", title: "Big Smile" },
    { bg: "#f5e8f2", hair: "#28232c", shirt: "#9b5de5", acc: "😉", title: "Wink & Point" },
    { bg: "#edf6f9", hair: "#38312e", shirt: "#00bbf9", acc: "🕶️", title: "Cool Shades" },
    { bg: "#fff1e6", hair: "#222222", shirt: "#f15bb5", acc: "🌸", title: "Flower Face" },
    { bg: "#e8f0fe", hair: "#40322b", shirt: "#fee440", acc: "🐱", title: "Cat Whiskers" },
    { bg: "#fbf8cc", hair: "#2d2926", shirt: "#00f5d4", acc: "💖", title: "Cheek Heart" },
  ];

  return poses.map((p, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 960;
    const ctx = canvas.getContext("2d");

    // Studio backdrop gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 960);
    grad.addColorStop(0, p.bg);
    grad.addColorStop(1, "#cfd8dc");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 720, 960);

    // Studio ambient shadow
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.beginPath();
    ctx.ellipse(360, 900, 260, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body / Shoulders
    ctx.fillStyle = p.shirt;
    ctx.beginPath();
    ctx.ellipse(360, 980, 240, 320, 0, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = "#f5d0b5";
    ctx.fillRect(320, 560, 80, 110);

    // Head / Face
    ctx.fillStyle = "#ffe2cc";
    ctx.beginPath();
    ctx.ellipse(360, 480, 130, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = p.hair;
    ctx.beginPath();
    ctx.ellipse(360, 420, 145, 120, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Hair sides
    ctx.beginPath();
    ctx.ellipse(230, 480, 40, 90, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(490, 480, 40, 90, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#2d241e";
    ctx.beginPath();
    ctx.ellipse(310, 475, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(410, 475, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(307, 470, 5, 0, Math.PI * 2);
    ctx.arc(407, 470, 5, 0, Math.PI * 2);
    ctx.fill();

    // Blush cheeks
    ctx.fillStyle = "rgba(255, 105, 135, 0.35)";
    ctx.beginPath();
    ctx.ellipse(285, 515, 26, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(435, 515, 26, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = "#994d50";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(360, 520, 32, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Pose accessory emoji
    ctx.font = "90px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.acc, 530, 720);

    // Shot watermark
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`SHOT #0${index + 1} · STUDIO SNAP`, 40, 70);

    // Film border line
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 706, 946);

    return canvas.toDataURL("image/jpeg", 0.92);
  });
}
