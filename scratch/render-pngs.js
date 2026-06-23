const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");

async function run() {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Helper to render an SVG file to PNG
  async function renderSvgToPng(svgPath, pngPath, width, height) {
    console.log(
      `Rendering ${path.basename(svgPath)} to ${path.basename(pngPath)} (${width}x${height})...`,
    );

    // Read the SVG content
    let svgContent = fs.readFileSync(svgPath, "utf8");

    // Set viewport
    await page.setViewportSize({ width, height });

    // Load the SVG directly into the page
    await page.setContent(`
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: transparent;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
              width: ${width}px;
              height: ${height}px;
            }
            svg {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `);

    // Take a screenshot of the body with transparent background
    await page.screenshot({
      path: pngPath,
      omitBackground: true,
      type: "png",
    });
  }

  const publicDir = path.join(__dirname, "../public");
  const iconsDir = path.join(publicDir, "icons");
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // 1. Render logo.svg -> logo.png (240x64)
  await renderSvgToPng(path.join(publicDir, "logo.svg"), path.join(publicDir, "logo.png"), 240, 64);

  // 2. Render favicon.svg -> favicon.png (512x512)
  await renderSvgToPng(
    path.join(publicDir, "favicon.svg"),
    path.join(publicDir, "favicon.png"),
    512,
    512,
  );

  // 3. Render favicon.svg -> android-chrome-512x512.png (512x512)
  await renderSvgToPng(
    path.join(publicDir, "favicon.svg"),
    path.join(iconsDir, "android-chrome-512x512.png"),
    512,
    512,
  );

  // 4. Render favicon.svg -> android-chrome-192x192.png (192x192)
  await renderSvgToPng(
    path.join(publicDir, "favicon.svg"),
    path.join(iconsDir, "android-chrome-192x192.png"),
    192,
    192,
  );

  console.log("Closing browser...");
  await browser.close();
  console.log("PNG generation successfully completed!");
}

run().catch((err) => {
  console.error("Error rendering PNGs:", err);
  process.exit(1);
});
