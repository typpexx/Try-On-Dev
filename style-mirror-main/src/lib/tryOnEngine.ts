function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to load image"));
    img.src = src;
  });
}

export async function generateTryOnImage(userPhotoUrl: string, productImageUrl: string) {
  const [userImage, productImage] = await Promise.all([loadImage(userPhotoUrl), loadImage(productImageUrl)]);
  const width = 900;
  const height = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context unavailable");
  }

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(userImage, 0, 0, width, height);

  // Simulated garment extraction and warp area for MVP preview.
  const torsoX = width * 0.22;
  const torsoY = height * 0.2;
  const torsoW = width * 0.56;
  const torsoH = height * 0.52;

  ctx.save();
  ctx.globalAlpha = 0.74;
  ctx.beginPath();
  ctx.roundRect(torsoX, torsoY, torsoW, torsoH, 24);
  ctx.clip();
  ctx.drawImage(productImage, torsoX, torsoY, torsoW, torsoH);
  ctx.restore();

  const gradient = ctx.createLinearGradient(0, torsoY, 0, torsoY + torsoH);
  gradient.addColorStop(0, "rgba(15, 23, 42, 0.1)");
  gradient.addColorStop(1, "rgba(15, 23, 42, 0.35)");
  ctx.fillStyle = gradient;
  ctx.fillRect(torsoX, torsoY, torsoW, torsoH);

  ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
  ctx.fillRect(20, 20, 300, 92);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText("AI Try-On Preview", 38, 56);
  ctx.font = "400 15px Inter, sans-serif";
  ctx.fillText("Body detect + cloth warp (MVP)", 38, 84);

  return canvas.toDataURL("image/jpeg", 0.92);
}
