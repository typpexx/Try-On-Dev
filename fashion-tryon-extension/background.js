const DEFAULT_CONFIG = {
  enabled: true,
  apiEndpoint: "https://api.tryon.ai/v1/generate",
  apiKey: "",
};

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.sync.get(["enabled", "apiEndpoint", "apiKey"]);
  const merged = { ...DEFAULT_CONFIG, ...current };
  await chrome.storage.sync.set(merged);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "tryon_request") {
    handleTryOnRequest(message.payload)
      .then((result) => sendResponse({ ok: true, data: result }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message?.type === "affiliate_click") {
    chrome.storage.local.get(["affiliateClicks"], (store) => {
      const history = Array.isArray(store.affiliateClicks) ? store.affiliateClicks : [];
      history.unshift({
        id: crypto.randomUUID(),
        brand: message.payload.brand ?? "unknown",
        productUrl: message.payload.productUrl ?? "",
        clickedAt: new Date().toISOString(),
      });
      chrome.storage.local.set({ affiliateClicks: history.slice(0, 1000) });
    });
  }
});

async function handleTryOnRequest(payload) {
  const { apiEndpoint, apiKey } = await chrome.storage.sync.get(["apiEndpoint", "apiKey"]);
  if (!apiEndpoint) {
    return { mode: "fallback", resultImage: payload.userImage };
  }

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      userImage: payload.userImage,
      productImage: payload.productImage,
      metadata: payload.metadata,
    }),
  }).catch(() => null);

  if (!response || !response.ok) {
    return { mode: "fallback", resultImage: payload.userImage };
  }

  const data = await response.json().catch(() => ({}));
  return {
    mode: "api",
    resultImage: data.resultImage || payload.userImage,
    requestId: data.requestId || crypto.randomUUID(),
  };
}
