const DEFAULT_BRAND_SELECTORS = {
  "zara.com": {
    brand: "Zara",
    image:
      "img[data-qa-anchor='product-image'], img[data-qa-qualifier='product-detail-image'], .product-grid-product img, .product-grid__product img, picture img",
  },
  "gucci.com": {
    brand: "Gucci",
    image: "img[data-testid='hero-image'], .product-gallery img",
  },
  "fashionnova.com": {
    brand: "Fashion Nova",
    image: ".product-main-image img, .product-single__media img",
  },
};

const injected = new WeakSet();
let modalRoot = null;
let runtimeSelectorMap = DEFAULT_BRAND_SELECTORS;
let runtimeActiveDomains = Object.keys(DEFAULT_BRAND_SELECTORS);

init();

async function init() {
  const config = await chrome.storage.sync.get(["enabled", "selectorMap", "activeDomains"]);
  if (config.enabled === false) return;
  ensureUiStyles();
  runtimeSelectorMap = {
    ...DEFAULT_BRAND_SELECTORS,
    ...(config.selectorMap || {}),
  };
  runtimeActiveDomains = Array.isArray(config.activeDomains) ? config.activeDomains : Object.keys(runtimeSelectorMap);
  detectProducts();
  const observer = new MutationObserver(() => detectProducts());
  observer.observe(document.body, { childList: true, subtree: true });
}

function detectProducts() {
  const hostname = window.location.hostname;
  const selectorConfig = Object.entries(runtimeSelectorMap).find(([domain]) => hostname.includes(domain));
  if (runtimeActiveDomains.length && !runtimeActiveDomains.some((domain) => hostname.includes(domain))) {
    return;
  }
  const selector = selectorConfig ? selectorConfig[1].image : "img";
  const brand = selectorConfig ? selectorConfig[1].brand : "Unknown";
  const nodes = document.querySelectorAll(selector);
  const fallbackNodes = document.querySelectorAll(
    "main img, section img, article img, [class*='product'] img, [data-product] img",
  );
  const candidates = nodes.length > 0 ? nodes : fallbackNodes;

  candidates.forEach((node) => {
    if (!(node instanceof HTMLImageElement)) return;
    const rect = node.getBoundingClientRect();
    const minRenderable = rect.width >= 120 && rect.height >= 120;
    if (!minRenderable) return;
    if (injected.has(node)) return;
    injected.add(node);
    addTryOnButton(node, brand);
  });
}

function addTryOnButton(image, brand) {
  const wrapper =
    image.closest("article") ||
    image.closest("li") ||
    image.closest("[class*='product']") ||
    image.parentElement;
  if (!wrapper) {
    return;
  }

  if (getComputedStyle(wrapper).position === "static") {
    wrapper.style.position = "relative";
  }

  const button = document.createElement("button");
  button.textContent = "Try On";
  button.className = "vf-tryon-btn";
  Object.assign(button.style, {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    zIndex: "99",
    border: "none",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#0f172a",
    background: "linear-gradient(135deg, #fde68a, #facc15)",
    cursor: "pointer",
    boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
  });
  button.style.setProperty("z-index", "2147483645", "important");
  button.style.setProperty("pointer-events", "auto", "important");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openTryOnModal({ imageUrl: image.currentSrc || image.src, brand, productUrl: window.location.href });
  });

  wrapper.appendChild(button);
}

function openTryOnModal({ imageUrl, brand, productUrl }) {
  if (modalRoot) {
    modalRoot.remove();
  }

  modalRoot = document.createElement("div");
  Object.assign(modalRoot.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483646",
    background: "rgba(2, 6, 23, 0.8)",
    display: "grid",
    placeItems: "center",
    padding: "20px",
  });

  const panel = document.createElement("div");
  panel.className = "vf-panel";

  panel.innerHTML = `
    <header class="vf-header">
      <div>
        <h3 class="vf-title">Virtual Try-On Studio</h3>
        <p class="vf-subtitle">${brand} · Smart fit preview</p>
      </div>
      <button id="vf-close" class="vf-close-btn">Close</button>
    </header>

    <div class="vf-grid">
      <section class="vf-card">
        <div class="vf-card-head">
          <span>Selected Product</span>
        </div>
        <img src="${imageUrl}" class="vf-product-image" />

        <div class="vf-upload-wrap">
          <p class="vf-label">Upload your photo</p>
          <label for="vf-user-upload" class="vf-upload-dropzone">
            <span class="vf-upload-main">Choose model photo</span>
            <span class="vf-upload-sub">JPG/PNG · full body preferred</span>
          </label>
          <input id="vf-user-upload" type="file" accept="image/*" class="vf-hidden-upload" />
          <p id="vf-upload-name" class="vf-upload-name">No file selected</p>
        </div>

        <div class="vf-bodytype-wrap">
          <p class="vf-label">Body type</p>
          <div class="vf-bodytype-group">
            <button type="button" class="vf-body-btn" data-value="S">S</button>
            <button type="button" class="vf-body-btn active" data-value="M">M</button>
            <button type="button" class="vf-body-btn" data-value="L">L</button>
          </div>
        </div>

        <button id="vf-generate" class="vf-generate-btn">
          Generate Try-On Preview
        </button>
      </section>

      <section class="vf-card">
        <div class="vf-card-head">
          <span>Result</span>
          <span class="vf-result-chip">AI Styled</span>
        </div>
        <div id="vf-result-wrap" class="vf-result-wrap">
          <div class="vf-result-placeholder">
            <p class="vf-result-placeholder-main">Your try-on result appears here</p>
            <p class="vf-result-placeholder-sub">Upload your photo, pick body type, then generate.</p>
          </div>
        </div>
        <button id="vf-download" class="vf-download-btn" disabled>Download Result</button>
      </section>
    </div>
  `;

  modalRoot.appendChild(panel);
  document.body.appendChild(modalRoot);

  panel.querySelector("#vf-close")?.addEventListener("click", () => modalRoot?.remove());
  modalRoot.addEventListener("click", (event) => {
    if (event.target === modalRoot) {
      modalRoot.remove();
    }
  });

  const uploadInput = panel.querySelector("#vf-user-upload");
  const uploadName = panel.querySelector("#vf-upload-name");
  const bodyButtons = panel.querySelectorAll(".vf-body-btn");
  const downloadBtn = panel.querySelector("#vf-download");

  let selectedBodyType = "M";
  let latestOutput = "";

  bodyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedBodyType = btn.dataset.value || "M";
      bodyButtons.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  uploadInput?.addEventListener("change", () => {
    const file = uploadInput?.files?.[0];
    if (!uploadName) return;
    uploadName.textContent = file ? `Selected: ${file.name}` : "No file selected";
  });

  downloadBtn?.addEventListener("click", () => {
    if (!latestOutput) return;
    const link = document.createElement("a");
    link.href = latestOutput;
    link.download = `tryon-${brand.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    link.click();
  });

  panel.querySelector("#vf-generate")?.addEventListener("click", async () => {
    const resultWrap = panel.querySelector("#vf-result-wrap");
    const file = uploadInput?.files?.[0];
    if (!resultWrap) {
      return;
    }
    if (!file) {
      resultWrap.textContent = "Upload your photo first.";
      return;
    }

    resultWrap.innerHTML = `
      <div class="vf-result-placeholder">
        <p class="vf-result-placeholder-main">Generating...</p>
        <p class="vf-result-placeholder-sub">Preparing your virtual outfit.</p>
      </div>
    `;
    const userImage = await fileToDataUrl(file);
    const productImage = imageUrl;
    const fallbackResult = await composeFallback(userImage, productImage);

    const response = await chrome.runtime.sendMessage({
      type: "tryon_request",
      payload: {
        userImage,
        productImage,
        metadata: {
          bodyType: selectedBodyType,
          brand,
          productUrl,
        },
      },
    });

    const output = response?.ok ? response.data.resultImage : fallbackResult;
    latestOutput = output;
    resultWrap.innerHTML = `<img src="${output}" class="vf-result-image" />`;
    if (downloadBtn) {
      downloadBtn.disabled = false;
    }
    chrome.runtime.sendMessage({
      type: "affiliate_click",
      payload: { brand, productUrl },
    });
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function composeFallback(userImageSrc, productImageSrc) {
  const [userImage, productImage] = await Promise.all([loadImage(userImageSrc), loadImage(productImageSrc)]);
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return userImageSrc;

  ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.72;
  ctx.drawImage(productImage, canvas.width * 0.2, canvas.height * 0.22, canvas.width * 0.58, canvas.height * 0.5);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(2,6,23,0.7)";
  ctx.fillRect(20, 20, 270, 54);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "600 17px system-ui";
  ctx.fillText("Fallback AI Preview", 36, 53);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function ensureUiStyles() {
  if (document.getElementById("vf-tryon-styles")) return;
  const style = document.createElement("style");
  style.id = "vf-tryon-styles";
  style.textContent = `
    .vf-panel {
      width: min(980px, 95vw);
      max-height: 92vh;
      overflow: auto;
      background: linear-gradient(180deg, #020617 0%, #020b1f 100%);
      color: #e2e8f0;
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 20px 80px rgba(2, 6, 23, 0.5);
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    }
    .vf-header { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:14px; }
    .vf-title { margin:0; font-size:22px; letter-spacing:0.2px; }
    .vf-subtitle { margin:4px 0 0; color:#93a4c2; font-size:13px; }
    .vf-close-btn {
      border:1px solid rgba(148,163,184,0.35); background:rgba(15,23,42,0.55); color:#e2e8f0;
      padding:8px 12px; border-radius:10px; cursor:pointer; font-weight:600;
    }
    .vf-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .vf-card { border:1px solid rgba(148,163,184,0.16); border-radius:14px; background:rgba(2,6,23,0.55); padding:14px; }
    .vf-card-head { display:flex; justify-content:space-between; align-items:center; font-size:13px; margin-bottom:10px; color:#b8c5da; }
    .vf-result-chip { border:1px solid rgba(16,185,129,0.35); color:#34d399; border-radius:999px; padding:2px 8px; font-size:11px; }
    .vf-product-image { width:100%; height:280px; object-fit:cover; border-radius:12px; border:1px solid rgba(148,163,184,0.2); }
    .vf-label { margin:0; font-size:12px; color:#93a4c2; }
    .vf-upload-wrap { margin-top:12px; }
    .vf-upload-dropzone {
      margin-top:8px; border:1px dashed rgba(148,163,184,0.45); border-radius:10px; padding:12px;
      display:flex; flex-direction:column; gap:4px; cursor:pointer; background:rgba(15,23,42,0.35);
    }
    .vf-upload-main { font-size:13px; font-weight:600; color:#e2e8f0; }
    .vf-upload-sub { font-size:11px; color:#93a4c2; }
    .vf-hidden-upload { position:absolute; opacity:0; pointer-events:none; width:1px; height:1px; }
    .vf-upload-name { margin:8px 0 0; font-size:12px; color:#93a4c2; }
    .vf-bodytype-wrap { margin-top:12px; }
    .vf-bodytype-group { margin-top:8px; display:flex; gap:8px; }
    .vf-body-btn {
      border:1px solid rgba(148,163,184,0.32); background:#0f172a; color:#dbe5f5; width:38px; height:34px;
      border-radius:9px; cursor:pointer; font-weight:700;
    }
    .vf-body-btn.active { border-color:#facc15; color:#fef08a; box-shadow:inset 0 0 0 1px rgba(250,204,21,0.35); }
    .vf-generate-btn {
      margin-top:14px; width:100%; border:none; border-radius:11px; padding:12px 14px;
      background:linear-gradient(135deg,#10b981,#22c55e); color:#052e16; font-weight:800; cursor:pointer; letter-spacing:0.2px;
    }
    .vf-result-wrap {
      width:100%; height:410px; border-radius:12px; border:1px dashed rgba(148,163,184,0.4);
      display:grid; place-items:center; background:rgba(15,23,42,0.22);
    }
    .vf-result-placeholder { text-align:center; padding:16px; }
    .vf-result-placeholder-main { margin:0; color:#d6e0f0; font-size:16px; font-weight:600; }
    .vf-result-placeholder-sub { margin:6px 0 0; color:#93a4c2; font-size:12px; }
    .vf-result-image { width:100%; height:100%; object-fit:contain; border-radius:10px; }
    .vf-download-btn {
      margin-top:10px; width:100%; border:1px solid rgba(148,163,184,0.35); border-radius:10px; padding:10px;
      background:rgba(15,23,42,0.5); color:#e2e8f0; cursor:pointer; font-weight:600;
    }
    .vf-download-btn:disabled { opacity:0.45; cursor:not-allowed; }
    @media (max-width: 900px) {
      .vf-grid { grid-template-columns: 1fr; }
      .vf-product-image { height:220px; }
      .vf-result-wrap { height:320px; }
    }
  `;
  document.head.appendChild(style);
}
