const enabledInput = document.getElementById("enabled");
const apiEndpointInput = document.getElementById("apiEndpoint");
const apiKeyInput = document.getElementById("apiKey");
const saveBtn = document.getElementById("saveBtn");
const openOptions = document.getElementById("openOptions");
const statusEl = document.getElementById("status");

init();

async function init() {
  const settings = await chrome.storage.sync.get(["enabled", "apiEndpoint", "apiKey"]);
  enabledInput.checked = settings.enabled !== false;
  apiEndpointInput.value = settings.apiEndpoint || "";
  apiKeyInput.value = settings.apiKey || "";
}

saveBtn.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    enabled: enabledInput.checked,
    apiEndpoint: apiEndpointInput.value.trim(),
    apiKey: apiKeyInput.value.trim(),
  });
  statusEl.textContent = "Saved.";
});

openOptions.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
