// Generates a behind-the-scenes booth timelapse video/canvas stream
// and creates downloadable video blobs & animated previews

export function createTimelapseClip(photoList) {
  if (!photoList || !photoList.length) return null;

  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");

  // If MediaRecorder is supported, record canvas stream
  if (typeof MediaRecorder !== "undefined" && canvas.captureStream) {
    try {
      const stream = canvas.captureStream(15);
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      return new Promise((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };

        recorder.start();

        // Render each shot sequentially to simulate a 3-second timelapse clip
        let currentIdx = 0;
        const interval = setInterval(() => {
          if (currentIdx >= photoList.length * 2) {
            clearInterval(interval);
            recorder.stop();
            return;
          }

          const photo = photoList[currentIdx % photoList.length];
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Watermark & live timestamp
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(10, 10, 240, 40);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 14px sans-serif";
            ctx.fillText("🔴 REC · BEHIND THE SCENES", 20, 35);

            ctx.fillStyle = "#ff2a7a";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("PHOTO BOOTH LIVE TIMELAPSE", 20, 610);
          };
          img.src = photo;
          currentIdx++;
        }, 300);
      });
    } catch {
      // Fallback
    }
  }

  return Promise.resolve(null);
}
