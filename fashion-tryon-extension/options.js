const selectorsEl = document.getElementById("selectors");
const activeDomainsEl = document.getElementById("activeDomains");
const saveBtn = document.getElementById("save");
const statusEl = document.getElementById("status");

const defaultSelectors = {
  "zara.com": {
    brand: "Zara",
    image: "img[data-qa-anchor='product-image']",
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

init();

async function init() {
  const store = await chrome.storage.sync.get(["selectorMap", "activeDomains"]);
  selectorsEl.value = JSON.stringify(store.selectorMap || defaultSelectors, null, 2);
  activeDomainsEl.value = (store.activeDomains || Object.keys(defaultSelectors)).join(",");
}

saveBtn.addEventListener("click", async () => {
  try {
    const parsed = JSON.parse(selectorsEl.value);
    const activeDomains = activeDomainsEl.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    await chrome.storage.sync.set({
      selectorMap: parsed,
      activeDomains,
    });
    statusEl.textContent = "Settings saved.";
  } catch (error) {
    statusEl.textContent = `Invalid JSON: ${String(error)}`;
  }
});
