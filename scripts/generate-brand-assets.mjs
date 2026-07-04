import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const BRAND_ASSETS_DIR = path.resolve("public/brand-assets");

// Ensure the directory exists
if (!fs.existsSync(BRAND_ASSETS_DIR)) {
  fs.mkdirSync(BRAND_ASSETS_DIR, { recursive: true });
}

// 1. Dark Theme SVG Logo
const logoDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" width="240" height="64" role="img" aria-label="ALPAR AI">
  <defs>
    <!-- Corporate Blue Gradient -->
    <linearGradient id="alpar-corp-grad-dark" x1="16" y1="12" x2="82" y2="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F62FE" />
      <stop offset="100%" stop-color="#008DF8" />
    </linearGradient>
  </defs>

  <!-- Left: Shield, Scales & Tech Circuit Icon -->
  <g transform="translate(6, 4) scale(0.85)">
    <path d="M 50,10 V 70" stroke="url(#alpar-corp-grad-dark)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,15 C 28,16 14,20 14,28 V 50 C 14,60 32,66 50,67" fill="none" stroke="url(#alpar-corp-grad-dark)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,32 H 26" stroke="url(#alpar-corp-grad-dark)" stroke-width="3" stroke-linecap="round" />
    <path d="M 26,32 L 15,51 H 37 Z" fill="none" stroke="url(#alpar-corp-grad-dark)" stroke-width="2.2" stroke-linejoin="round" />
    <path d="M 18.5,51 C 18.5,55 33.5,55 33.5,51 Z" fill="url(#alpar-corp-grad-dark)" />
    <path d="M 36,60 H 64" stroke="url(#alpar-corp-grad-dark)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,24 H 68 L 78,14 H 82" fill="none" stroke="url(#alpar-corp-grad-dark)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="14" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
    <path d="M 50,38 H 80" fill="none" stroke="url(#alpar-corp-grad-dark)" stroke-width="3" stroke-linecap="round" />
    <circle cx="80" cy="38" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
    <path d="M 50,52 H 68 L 78,62 H 82" fill="none" stroke="url(#alpar-corp-grad-dark)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="62" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
  </g>

  <!-- Right: Wordmark (Optimized for Dark Backgrounds) -->
  <g transform="translate(86, 0)" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="800" letter-spacing="-0.5">
    <text x="0" y="38" font-size="24" fill="#FFFFFF">ALPAR</text>
    <text x="86" y="38" font-size="24" font-weight="400" fill="#0F62FE" letter-spacing="0.5">AI</text>
  </g>
</svg>`;

// 2. Light Theme SVG Logo
const logoLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" width="240" height="64" role="img" aria-label="ALPAR AI">
  <defs>
    <!-- Corporate Blue Gradient -->
    <linearGradient id="alpar-corp-grad-light" x1="16" y1="12" x2="82" y2="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F62FE" />
      <stop offset="100%" stop-color="#008DF8" />
    </linearGradient>
  </defs>

  <!-- Left: Shield, Scales & Tech Circuit Icon -->
  <g transform="translate(6, 4) scale(0.85)">
    <path d="M 50,10 V 70" stroke="url(#alpar-corp-grad-light)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,15 C 28,16 14,20 14,28 V 50 C 14,60 32,66 50,67" fill="none" stroke="url(#alpar-corp-grad-light)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,32 H 26" stroke="url(#alpar-corp-grad-light)" stroke-width="3" stroke-linecap="round" />
    <path d="M 26,32 L 15,51 H 37 Z" fill="none" stroke="url(#alpar-corp-grad-light)" stroke-width="2.2" stroke-linejoin="round" />
    <path d="M 18.5,51 C 18.5,55 33.5,55 33.5,51 Z" fill="url(#alpar-corp-grad-light)" />
    <path d="M 36,60 H 64" stroke="url(#alpar-corp-grad-light)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,24 H 68 L 78,14 H 82" fill="none" stroke="url(#alpar-corp-grad-light)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="14" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
    <path d="M 50,38 H 80" fill="none" stroke="url(#alpar-corp-grad-light)" stroke-width="3" stroke-linecap="round" />
    <circle cx="80" cy="38" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
    <path d="M 50,52 H 68 L 78,62 H 82" fill="none" stroke="url(#alpar-corp-grad-light)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="62" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
  </g>

  <!-- Right: Wordmark (Optimized for Light Backgrounds) -->
  <g transform="translate(86, 0)" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="800" letter-spacing="-0.5">
    <text x="0" y="38" font-size="24" fill="#0F172A">ALPAR</text>
    <text x="86" y="38" font-size="24" font-weight="400" fill="#0F62FE" letter-spacing="0.5">AI</text>
  </g>
</svg>`;

// 3. Monochrome White Logo
const logoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" width="240" height="64" role="img" aria-label="ALPAR AI">
  <!-- Left: Shield, Scales & Tech Circuit Icon -->
  <g transform="translate(6, 4) scale(0.85)">
    <path d="M 50,10 V 70" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,15 C 28,16 14,20 14,28 V 50 C 14,60 32,66 50,67" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,32 H 26" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
    <path d="M 26,32 L 15,51 H 37 Z" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linejoin="round" />
    <path d="M 18.5,51 C 18.5,55 33.5,55 33.5,51 Z" fill="#FFFFFF" />
    <path d="M 36,60 H 64" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,24 H 68 L 78,14 H 82" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="14" r="3.5" fill="#FFFFFF" />
    <path d="M 50,38 H 80" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
    <circle cx="80" cy="38" r="3.5" fill="#FFFFFF" />
    <path d="M 50,52 H 68 L 78,62 H 82" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="62" r="3.5" fill="#FFFFFF" />
  </g>

  <!-- Right: Wordmark -->
  <g transform="translate(86, 0)" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="800" letter-spacing="-0.5">
    <text x="0" y="38" font-size="24" fill="#FFFFFF">ALPAR</text>
    <text x="86" y="38" font-size="24" font-weight="400" fill="#FFFFFF" letter-spacing="0.5">AI</text>
  </g>
</svg>`;

// 4. Monochrome Black Logo
const logoBlackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" width="240" height="64" role="img" aria-label="ALPAR AI">
  <!-- Left: Shield, Scales & Tech Circuit Icon -->
  <g transform="translate(6, 4) scale(0.85)">
    <path d="M 50,10 V 70" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,15 C 28,16 14,20 14,28 V 50 C 14,60 32,66 50,67" fill="none" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,32 H 26" stroke="#000000" stroke-width="3" stroke-linecap="round" />
    <path d="M 26,32 L 15,51 H 37 Z" fill="none" stroke="#000000" stroke-width="2.2" stroke-linejoin="round" />
    <path d="M 18.5,51 C 18.5,55 33.5,55 33.5,51 Z" fill="#000000" />
    <path d="M 36,60 H 64" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,24 H 68 L 78,14 H 82" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="14" r="3.5" fill="#000000" />
    <path d="M 50,38 H 80" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" />
    <circle cx="80" cy="38" r="3.5" fill="#000000" />
    <path d="M 50,52 H 68 L 78,62 H 82" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="62" r="3.5" fill="#000000" />
  </g>

  <!-- Right: Wordmark -->
  <g transform="translate(86, 0)" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-weight="800" letter-spacing="-0.5">
    <text x="0" y="38" font-size="24" fill="#000000">ALPAR</text>
    <text x="86" y="38" font-size="24" font-weight="400" fill="#000000" letter-spacing="0.5">AI</text>
  </g>
</svg>`;

// 5. Icon Primary SVG (viewBox adjusted to 64x64 square)
const iconPrimarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="ALPAR AI Icon">
  <defs>
    <!-- Corporate Blue Gradient -->
    <linearGradient id="alpar-corp-grad-icon" x1="16" y1="12" x2="82" y2="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F62FE" />
      <stop offset="100%" stop-color="#008DF8" />
    </linearGradient>
  </defs>

  <g transform="translate(-18, -8) scale(1.0)">
    <path d="M 50,10 V 70" stroke="url(#alpar-corp-grad-icon)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,15 C 28,16 14,20 14,28 V 50 C 14,60 32,66 50,67" fill="none" stroke="url(#alpar-corp-grad-icon)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,32 H 26" stroke="url(#alpar-corp-grad-icon)" stroke-width="3" stroke-linecap="round" />
    <path d="M 26,32 L 15,51 H 37 Z" fill="none" stroke="url(#alpar-corp-grad-icon)" stroke-width="2.2" stroke-linejoin="round" />
    <path d="M 18.5,51 C 18.5,55 33.5,55 33.5,51 Z" fill="url(#alpar-corp-grad-icon)" />
    <path d="M 36,60 H 64" stroke="url(#alpar-corp-grad-icon)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,24 H 68 L 78,14 H 82" fill="none" stroke="url(#alpar-corp-grad-icon)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="14" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
    <path d="M 50,38 H 80" fill="none" stroke="url(#alpar-corp-grad-icon)" stroke-width="3" stroke-linecap="round" />
    <circle cx="80" cy="38" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
    <path d="M 50,52 H 68 L 78,62 H 82" fill="none" stroke="url(#alpar-corp-grad-icon)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="62" r="3.5" fill="#FFFFFF" stroke="#0F62FE" stroke-width="2" />
  </g>
</svg>`;

// 6. Icon White SVG
const iconWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="ALPAR AI Icon">
  <g transform="translate(-18, -8) scale(1.0)">
    <path d="M 50,10 V 70" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,15 C 28,16 14,20 14,28 V 50 C 14,60 32,66 50,67" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,32 H 26" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
    <path d="M 26,32 L 15,51 H 37 Z" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linejoin="round" />
    <path d="M 18.5,51 C 18.5,55 33.5,55 33.5,51 Z" fill="#FFFFFF" />
    <path d="M 36,60 H 64" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,24 H 68 L 78,14 H 82" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="14" r="3.5" fill="#FFFFFF" />
    <path d="M 50,38 H 80" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
    <circle cx="80" cy="38" r="3.5" fill="#FFFFFF" />
    <path d="M 50,52 H 68 L 78,62 H 82" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="62" r="3.5" fill="#FFFFFF" />
  </g>
</svg>`;

// 7. Icon Black SVG
const iconBlackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="ALPAR AI Icon">
  <g transform="translate(-18, -8) scale(1.0)">
    <path d="M 50,10 V 70" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,15 C 28,16 14,20 14,28 V 50 C 14,60 32,66 50,67" fill="none" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,32 H 26" stroke="#000000" stroke-width="3" stroke-linecap="round" />
    <path d="M 26,32 L 15,51 H 37 Z" fill="none" stroke="#000000" stroke-width="2.2" stroke-linejoin="round" />
    <path d="M 18.5,51 C 18.5,55 33.5,55 33.5,51 Z" fill="#000000" />
    <path d="M 36,60 H 64" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 50,24 H 68 L 78,14 H 82" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="14" r="3.5" fill="#000000" />
    <path d="M 50,38 H 80" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" />
    <circle cx="80" cy="38" r="3.5" fill="#000000" />
    <path d="M 50,52 H 68 L 78,62 H 82" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="82" cy="62" r="3.5" fill="#000000" />
  </g>
</svg>`;

// 8. Brand Guidelines markdown
const guidelinesMarkdown = `# ALPAR AI — Brand Assets Guidelines

ALPAR AI is the trust infrastructure for AI accountability. Use these brand assets to represent ALPAR AI in reports, presentations, and website links.

## Color Palette

- **Primary Accent (Corporate Blue)**: \`#0F62FE\` (IBM Blue / Trust & Authority).
- **Secondary Accent (Cyber Blue)**: \`#008DF8\` (Precision / Connectivity).
- **Dark Background (Deep Slate)**: \`#0A1622\` / \`#0B1622\`.
- **Text & Details (Off-White)**: \`#F8FAFC\` / \`#CBD5E1\`.

## Asset Types

- **logo-dark-theme.svg**: Primary logotype for dark backgrounds.
- **logo-light-theme.svg**: Primary logotype for light backgrounds.
- **logo-monochrome-white.svg**: Flat white logo for dark brand styling.
- **logo-monochrome-black.svg**: Flat black logo for print layouts.
- **icon-primary.svg**: Just the neural-shield icon mark in full color.
- **icon-white.svg**: White icon mark.
- **icon-black.svg**: Black icon mark.

Thank you for respecting our brand representation guidelines.
`;

// Write the files to the assets folder
console.log("Writing brand assets...");
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "logo-dark-theme.svg"), logoDarkSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "logo-light-theme.svg"), logoLightSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "logo-monochrome-white.svg"), logoWhiteSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "logo-monochrome-black.svg"), logoBlackSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "icon-primary.svg"), iconPrimarySvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "icon-white.svg"), iconWhiteSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "icon-black.svg"), iconBlackSvg);
fs.writeFileSync(path.join(BRAND_ASSETS_DIR, "README.md"), guidelinesMarkdown);

// Also overwrite the public/logo.svg to match our beautiful updated logo!
fs.writeFileSync(path.resolve("public/logo.svg"), logoLightSvg);
console.log("Assets created. Overwrote public/logo.svg.");

// Create ZIP file using Powershell command
try {
  console.log("Creating ZIP archive...");
  execSync(
    'powershell -Command "Compress-Archive -Path \'public/brand-assets/*\' -DestinationPath \'public/brand-assets.zip\' -Force"'
  );
  console.log("Zip archive created successfully at public/brand-assets.zip");
} catch (err) {
  console.error("Failed to create ZIP using Powershell. Attempting fallback.", err.message);
}
