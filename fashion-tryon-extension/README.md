# Virtual Fashion Try-On Extension (Chrome MVP)

This extension injects a `Try On` button on product images, captures user photo input, sends a try-on request to an API, and shows a generated result overlay.

## Features

- Product detection on major fashion domains
- Try-On button injection on product images
- Overlay modal with upload + body type
- API request bridge through background service worker
- Fallback preview generation when API is unavailable
- Affiliate click logging in local extension storage
- Popup controls for endpoint/API key
- Options page for selector configuration

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder: `fashion-tryon-extension`

## Configure

- Open extension popup to set:
  - `enabled`
  - `apiEndpoint`
  - `apiKey`
- Open options page to manage selector JSON and active domains.

## API Contract (expected)

POST `apiEndpoint`

```json
{
  "userImage": "data:image/jpeg;base64,...",
  "productImage": "https://example.com/image.jpg",
  "metadata": {
    "bodyType": "M",
    "brand": "Zara",
    "productUrl": "https://..."
  }
}
```

Expected response:

```json
{
  "requestId": "optional-id",
  "resultImage": "data:image/jpeg;base64,..."
}
```
